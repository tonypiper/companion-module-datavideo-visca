/**
 * Mock DVIP server for testing the Datavideo VISCA Companion module.
 *
 * Listens on a TCP port, logs all received VISCA commands, and sends back
 * ACK + Completion responses so the module behaves as if connected to a camera.
 *
 * Usage:
 *   node tools/dvip-mock.js [port]
 *
 * Default port is 5002 (standard DVIP port).
 * Point Companion at 127.0.0.1:<port> to test.
 */

import net from 'node:net'

const PORT = parseInt(process.argv[2], 10) || 5002

function formatHex(buf) {
	return buf.toString('hex').match(/../g).join(' ')
}

// Pan-tilt direction decoding from the two direction bytes
const PT_DIRECTIONS = {
	'01 01': 'Up-Left',
	'02 01': 'Up-Right',
	'03 01': 'Up',
	'01 02': 'Down-Left',
	'02 02': 'Down-Right',
	'03 02': 'Down',
	'01 03': 'Left',
	'02 03': 'Right',
	'03 03': 'Stop',
}

// AE mode byte to name
const AE_MODES = {
	0x00: 'Full Auto',
	0x03: 'Manual',
	0x0a: 'Shutter Priority',
	0x0b: 'Iris Priority',
	0x0d: 'Bright',
}

// Focus mode byte to name
const FOCUS_MODES = {
	0x02: 'Auto',
	0x03: 'Manual',
}

// Tally colour patterns (last 3 bytes before FF)
const TALLY_COLOURS = {
	'00 02 03': 'Red',
	'00 03 02': 'Green',
	'00 03 03': 'Off',
}

/**
 * Decode a VISCA command into a human-readable description.
 * viscaBytes includes the device address as the first byte.
 */
function identifyCommand(viscaBytes) {
	if (viscaBytes.length < 3) return 'Unknown (too short)'

	const b = viscaBytes // shorthand
	const cmd1 = b[1] // 01=command, 09=inquiry
	const cmd2 = b[2] // category

	// --- Inquiries ---
	if (cmd1 === 0x09) {
		if (cmd2 === 0x7e && b[3] === 0x7e && b[4] === 0x70) return 'Status Inquiry (legacy)'
		if (cmd2 === 0x04 && b[3] === 0x47) return 'Zoom Position Inquiry'
		if (cmd2 === 0x04 && b[3] === 0x48) return 'Focus Position Inquiry'
		if (cmd2 === 0x04 && b[3] === 0x38) return 'Focus Mode Inquiry'
		if (cmd2 === 0x04 && b[3] === 0x35) return 'WB Mode Inquiry'
		if (cmd2 === 0x04 && b[3] === 0x39) return 'AE Mode Inquiry'
		if (cmd2 === 0x04 && b[3] === 0x4a) return 'Shutter Position Inquiry'
		if (cmd2 === 0x04 && b[3] === 0x4b) return 'Iris Position Inquiry'
		if (cmd2 === 0x06 && b[3] === 0x12) return 'Pan-Tilt Position Inquiry'
		if (cmd2 === 0x04 && b[3] === 0x00) return 'Power Status Inquiry'
		if (cmd2 === 0x04 && b[3] === 0x43) return 'R Gain Inquiry'
		if (cmd2 === 0x04 && b[3] === 0x44) return 'B Gain Inquiry'
		if (cmd2 === 0x04 && b[3] === 0x4c) return 'Gain Position Inquiry'
		if (cmd2 === 0x04 && b[3] === 0x33) return 'Backlight Inquiry'
		return 'Inquiry (unknown)'
	}

	// --- Commands ---
	if (cmd1 !== 0x01) return 'Unknown'

	// OSD On/Off: 01 06 06 XX FF
	if (cmd2 === 0x06 && b[3] === 0x06) {
		if (b[4] === 0x02) return 'OSD On'
		if (b[4] === 0x03) return 'OSD Off'
		return `OSD Toggle (0x${b[4].toString(16)})`
	}

	// Pan-Tilt Drive: 01 06 01 VV WW XX YY FF
	if (cmd2 === 0x06 && b[3] === 0x01 && b.length >= 8) {
		const panSpeed = b[4]
		const tiltSpeed = b[5]
		const dirKey = formatHex(b.subarray(6, 8))
		const dir = PT_DIRECTIONS[dirKey] || `dir(${dirKey})`

		// OSD navigation uses specific speeds to distinguish from normal PT
		if (panSpeed === 0x0a && tiltSpeed === 0x0a) {
			const osdDir = { Up: 'Up', Down: 'Down', Left: 'Left', Right: 'Right', Stop: 'Stop' }
			return `OSD ${osdDir[dir] || dir}`
		}
		if (panSpeed === 0x09 && tiltSpeed === 0x09) {
			return `OSD Back`
		}
		if (panSpeed === 0x01 && tiltSpeed === 0x01 && dirKey === '03 03') {
			return 'OSD Stop'
		}

		return `Pan-Tilt ${dir} (pan=${panSpeed} tilt=${tiltSpeed})`
	}

	// Pan-Tilt Home: 01 06 04
	if (cmd2 === 0x06 && b[3] === 0x04) return 'Pan-Tilt Home'

	// Pan-Tilt Absolute: 01 06 02 VV WW ...
	if (cmd2 === 0x06 && b[3] === 0x02) return 'Pan-Tilt Absolute Position'

	// Zoom: 01 04 07 XX FF
	if (cmd2 === 0x04 && b[3] === 0x07) {
		const zb = b[4]
		if (zb === 0x00) return 'Zoom Stop'
		if (zb >= 0x20 && zb <= 0x27) return `Zoom In (speed=${zb - 0x20})`
		if (zb >= 0x30 && zb <= 0x37) return `Zoom Out (speed=${zb - 0x30})`
		return `Zoom (0x${zb.toString(16)})`
	}

	// Zoom Direct: 01 04 47 0p 0q 0r 0s FF
	if (cmd2 === 0x04 && b[3] === 0x47 && b.length >= 8) {
		const pos = ((b[4] & 0x0f) << 12) | ((b[5] & 0x0f) << 8) | ((b[6] & 0x0f) << 4) | (b[7] & 0x0f)
		return `Zoom Direct (position=0x${pos.toString(16).padStart(4, '0')})`
	}

	// Focus: 01 04 08 XX FF
	if (cmd2 === 0x04 && b[3] === 0x08) {
		const fb = b[4]
		if (fb === 0x00) return 'Focus Stop'
		if (fb === 0x02) return 'Focus Far'
		if (fb === 0x03) return 'Focus Near'
		return `Focus (0x${fb.toString(16)})`
	}

	// Focus Mode: 01 04 38 XX FF
	if (cmd2 === 0x04 && b[3] === 0x38) {
		const mode = FOCUS_MODES[b[4]] || `0x${b[4].toString(16)}`
		return `Focus Mode: ${mode}`
	}

	// AE Mode: 01 04 39 XX FF
	if (cmd2 === 0x04 && b[3] === 0x39) {
		const mode = AE_MODES[b[4]] || `0x${b[4].toString(16)}`
		return `AE Mode: ${mode}`
	}

	// Iris Up/Down: 01 04 0B XX FF
	if (cmd2 === 0x04 && b[3] === 0x0b) {
		if (b[4] === 0x02) return 'Iris Up'
		if (b[4] === 0x03) return 'Iris Down'
		if (b[4] === 0x00) return 'Iris Reset'
		return `Iris (0x${b[4].toString(16)})`
	}

	// Iris Direct: 01 04 4B 00 00 0p 0q FF
	if (cmd2 === 0x04 && b[3] === 0x4b && b.length >= 8) {
		const val = ((b[6] & 0x0f) << 4) | (b[7] & 0x0f)
		return `Iris Direct (value=0x${val.toString(16).padStart(2, '0')})`
	}

	// Shutter Up/Down: 01 04 0A XX FF
	if (cmd2 === 0x04 && b[3] === 0x0a) {
		if (b[4] === 0x02) return 'Shutter Up'
		if (b[4] === 0x03) return 'Shutter Down'
		if (b[4] === 0x00) return 'Shutter Reset'
		return `Shutter (0x${b[4].toString(16)})`
	}

	// Shutter Direct: 01 04 4A 00 00 0p 0q FF
	if (cmd2 === 0x04 && b[3] === 0x4a && b.length >= 8) {
		const val = ((b[6] & 0x0f) << 4) | (b[7] & 0x0f)
		return `Shutter Direct (value=0x${val.toString(16).padStart(2, '0')})`
	}

	// Gain: 01 04 0C XX FF / 01 04 0D XX FF
	if (cmd2 === 0x04 && b[3] === 0x0c) {
		if (b[4] === 0x02) return 'Gain Up'
		if (b[4] === 0x03) return 'Gain Down'
		if (b[4] === 0x00) return 'Gain Reset'
		return `Gain (0x${b[4].toString(16)})`
	}

	// Power: 01 04 00 XX FF
	if (cmd2 === 0x04 && b[3] === 0x00) {
		if (b[4] === 0x02) return 'Power On'
		if (b[4] === 0x03) return 'Power Off (Standby)'
		return `Power (0x${b[4].toString(16)})`
	}

	// Backlight: 01 04 33 XX FF
	if (cmd2 === 0x04 && b[3] === 0x33) {
		if (b[4] === 0x02) return 'Backlight On'
		if (b[4] === 0x03) return 'Backlight Off'
		return `Backlight (0x${b[4].toString(16)})`
	}

	// Preset Save: 01 04 3F 01 pp FF
	if (cmd2 === 0x04 && b[3] === 0x3f && b[4] === 0x01 && b.length >= 6) {
		return `Preset Save #${b[5]}`
	}

	// Preset Recall: 01 04 3F 02 pp FF
	if (cmd2 === 0x04 && b[3] === 0x3f && b[4] === 0x02 && b.length >= 6) {
		return `Preset Recall #${b[5]}`
	}

	// 01 7E 01 XX — Tally, Preset Drive Speed, OSD Enter
	if (cmd2 === 0x7e && b[3] === 0x01) {
		// Preset Drive Speed: 01 7E 01 0B pp ss FF
		if (b[4] === 0x0b && b.length >= 7) {
			return `Preset Drive Speed #${b[5]} (speed=0x${b[6].toString(16)})`
		}

		// Tally (Two Tally): 01 7E 01 0A XX YY ZZ FF
		if (b[4] === 0x0a && b.length >= 8) {
			const tallyKey = formatHex(b.subarray(5, 8))
			const colour = TALLY_COLOURS[tallyKey] || `unknown(${tallyKey})`
			return `Tally: ${colour}`
		}

		// OSD Enter: 01 7E 01 02 00 01 FF
		if (b[4] === 0x02 && b[5] === 0x00 && b[6] === 0x01) {
			return 'OSD Enter'
		}

		return `Tally/Extended (0x${b[4].toString(16)})`
	}

	return 'Unknown'
}

function prependPacketSize(payload) {
	const size = payload.length + 2
	const header = Buffer.alloc(2)
	header.writeUInt16BE(size, 0)
	return Buffer.concat([header, payload])
}

function makeAck(address) {
	// ACK: x0 4y FF where x = address+8, y = socket number (use 1)
	const addr = ((address & 0x0f) + 8) << 4
	return Buffer.from([addr, 0x41, 0xff])
}

function makeCompletion(address) {
	// Completion: x0 5y FF
	const addr = ((address & 0x0f) + 8) << 4
	return Buffer.from([addr, 0x51, 0xff])
}

/**
 * Encode a 16-bit value as 4 nibble bytes: 0p 0q 0r 0s
 */
function encode4Nibble(value) {
	return [(value >> 12) & 0x0f, (value >> 8) & 0x0f, (value >> 4) & 0x0f, value & 0x0f]
}

/**
 * Build an inquiry response for the given address.
 * Returns null if no mock response is defined for this inquiry.
 */
function makeInquiryResponse(address, viscaBytes) {
	const addr = ((address & 0x0f) + 8) << 4
	const cmd2 = viscaBytes[2]
	const cmd3 = viscaBytes[3]

	// Single-byte response: addr 50 XX FF
	function singleByte(val) {
		return Buffer.from([addr, 0x50, val, 0xff])
	}

	// 4-nibble response: addr 50 0p 0q 0r 0s FF
	function fourNibble(val) {
		const nibbles = encode4Nibble(val)
		return Buffer.from([addr, 0x50, nibbles[0], nibbles[1], nibbles[2], nibbles[3], 0xff])
	}

	if (cmd2 === 0x04) {
		switch (cmd3) {
			case 0x47:
				return fourNibble(0x2000) // Zoom at 50%
			case 0x48:
				return fourNibble(0x1000) // Focus position
			case 0x38:
				return singleByte(0x02) // Focus mode: Auto
			case 0x00:
				return singleByte(0x02) // Power: On
			case 0x39:
				return singleByte(0x00) // AE: Auto
			case 0x4b:
				return fourNibble(0x000a) // Iris position
			case 0x4a:
				return fourNibble(0x0008) // Shutter position
			case 0x4c:
				return fourNibble(0x0004) // Gain position
			case 0x35:
				return singleByte(0x00) // WB: Auto
			case 0x33:
				return singleByte(0x03) // Backlight: Off
		}
	}

	// Pan-Tilt Position: addr 50 0p 0q 0r 0s 0a 0b 0c 0d FF
	if (cmd2 === 0x06 && cmd3 === 0x12) {
		const pan = encode4Nibble(0x0000) // Pan at centre
		const tilt = encode4Nibble(0x0000) // Tilt at centre
		return Buffer.from([addr, 0x50, ...pan, ...tilt, 0xff])
	}

	return null
}

const server = net.createServer((socket) => {
	const remote = `${socket.remoteAddress}:${socket.remotePort}`
	console.log(`\n[${timestamp()}] Connected: ${remote}`)

	let buffer = Buffer.alloc(0)

	socket.on('data', (data) => {
		buffer = Buffer.concat([buffer, data])

		// DVIP framing: 2-byte big-endian length prefix (includes the 2 length bytes)
		while (buffer.length >= 2) {
			const packetLen = buffer.readUInt16BE(0)

			if (packetLen < 2) {
				console.log(`[${timestamp()}] Invalid packet length: ${packetLen}, resetting buffer`)
				buffer = Buffer.alloc(0)
				break
			}

			if (buffer.length < packetLen) {
				break // Wait for more data
			}

			const packet = buffer.subarray(0, packetLen)
			buffer = buffer.subarray(packetLen)

			const viscaBytes = packet.subarray(2) // Strip DVIP size header
			const deviceAddr = viscaBytes[0] & 0x07
			const cmdName = identifyCommand(viscaBytes)
			const isInquiry = viscaBytes.length > 1 && viscaBytes[1] === 0x09
			const isUnknown = cmdName.startsWith('Unknown')

			// Clean format: just show the decoded command
			// Include raw hex only for unknown commands
			if (isUnknown) {
				console.log(`[${timestamp()}] ${cmdName}  [${formatHex(viscaBytes)}]`)
			} else {
				console.log(`[${timestamp()}] ${cmdName}`)
			}

			// Send inquiry response or ACK + Completion for commands
			if (isInquiry) {
				const response = makeInquiryResponse(deviceAddr, viscaBytes)
				if (response) {
					socket.write(prependPacketSize(response))
				} else {
					// Unknown inquiry — send completion as fallback
					socket.write(prependPacketSize(makeCompletion(deviceAddr)))
				}
			} else {
				const ack = prependPacketSize(makeAck(deviceAddr))
				const completion = prependPacketSize(makeCompletion(deviceAddr))
				socket.write(ack)
				socket.write(completion)
			}
		}
	})

	socket.on('close', () => {
		console.log(`[${timestamp()}] Disconnected: ${remote}`)
	})

	socket.on('error', (err) => {
		console.log(`[${timestamp()}] Socket error: ${err.message}`)
	})
})

function timestamp() {
	return new Date().toISOString().substr(11, 12)
}

server.on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		console.error(`Port ${PORT} is already in use. Stop the other process or use: node tools/dvip-mock.js <port>`)
	} else {
		console.error(`Server error: ${err.message}`)
	}
	throw new Error('Server startup failed')
})

server.listen(PORT, () => {
	console.log(`DVIP Mock Server listening on port ${PORT}`)
	console.log(`Point Companion to 127.0.0.1:${PORT}`)
	console.log('Press Ctrl+C to stop\n')
})
