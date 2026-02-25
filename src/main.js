const { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdatePresets = require('./presets')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const {
	IRIS_LABELS,
	SHUTTER_LABELS,
	FOCUS_MODE_AUTO,
	FOCUS_MODE_MANUAL,
	AE_MODE_AUTO,
	AE_MODE_MANUAL,
	AE_MODE_SHUTTER,
	AE_MODE_IRIS,
	AE_MODE_BRIGHT,
	WB_MODE_AUTO,
	WB_MODE_INDOOR,
	WB_MODE_OUTDOOR,
	WB_MODE_ONEPUSH,
	WB_MODE_VAR,
	WB_MODE_MANUAL,
} = require('./constants')

const AE_MODE_LABELS = {
	0x00: AE_MODE_AUTO,
	0x03: AE_MODE_MANUAL,
	0x0a: AE_MODE_SHUTTER,
	0x0b: AE_MODE_IRIS,
	0x0d: AE_MODE_BRIGHT,
}

const WB_MODE_LABELS = {
	0x00: WB_MODE_AUTO,
	0x01: WB_MODE_INDOOR,
	0x02: WB_MODE_OUTDOOR,
	0x03: WB_MODE_ONEPUSH,
	0x04: WB_MODE_VAR,
	0x05: WB_MODE_MANUAL,
	// Datavideo inquiry response values (confirmed on real hardware)
	0x20: WB_MODE_INDOOR,
	0x48: WB_MODE_OUTDOOR,
}

function parse4Nibble(b, offset) {
	return (
		((b[offset] & 0x0f) << 12) | ((b[offset + 1] & 0x0f) << 8) | ((b[offset + 2] & 0x0f) << 4) | (b[offset + 3] & 0x0f)
	)
}

function parseSigned16(value) {
	return value > 0x7fff ? value - 0x10000 : value
}

// Map VISCA command bytes to the inquiry that should follow
// Key format: "category.subcmd" from bytes [1] and [2] of the VISCA command
const COMMAND_TO_INQUIRY = {
	'06.01': 'pan_tilt_position', // Pan-Tilt drive
	'06.02': 'pan_tilt_position', // Pan-Tilt absolute
	'06.04': 'pan_tilt_position', // Pan-Tilt home
	'04.07': 'zoom_position', // Zoom in/out/stop
	'04.47': 'zoom_position', // Zoom direct
	'04.08': 'focus_position', // Focus near/far/stop
	'04.38': 'focus_mode', // Focus mode auto/manual
	'04.39': 'ae_mode', // AE mode
	'04.0b': 'iris_position', // Iris up/down
	'04.4b': 'iris_position', // Iris direct
	'04.0a': 'shutter_position', // Shutter up/down
	'04.4a': 'shutter_position', // Shutter direct
	'04.0c': 'gain_position', // Gain up/down/reset
	'04.03': 'rg_position', // Red gain up/down/reset
	'04.43': 'rg_position', // Red gain direct
	'04.04': 'bg_position', // Blue gain up/down/reset
	'04.44': 'bg_position', // Blue gain direct
	'04.33': 'backlight', // Backlight on/off
	'04.35': 'wb_mode', // White balance mode
	'04.20': 'wb_mode', // Color temperature direct
	'04.00': 'power_state', // Power on/off
}

const INQUIRIES = [
	{
		name: 'zoom_position',
		cmd: '\x09\x04\x47\xFF',
		parse(b) {
			const val = parse4Nibble(b, 2)
			return { zoom_position: ((val / 0x4000) * 100).toFixed(1) + '%' }
		},
	},
	{
		name: 'focus_position',
		cmd: '\x09\x04\x48\xFF',
		parse(b) {
			return { focus_position: parse4Nibble(b, 2) }
		},
	},
	{
		name: 'focus_mode',
		cmd: '\x09\x04\x38\xFF',
		parse(b) {
			return { focus_mode: b[2] === 0x02 ? FOCUS_MODE_AUTO : FOCUS_MODE_MANUAL }
		},
	},
	{
		name: 'power_state',
		cmd: '\x09\x04\x00\xFF',
		parse(b) {
			return { power_state: b[2] === 0x02 ? 'On' : 'Standby' }
		},
	},
	{
		name: 'ae_mode',
		cmd: '\x09\x04\x39\xFF',
		parse(b) {
			return { ae_mode: AE_MODE_LABELS[b[2]] || `0x${b[2].toString(16)}` }
		},
	},
	{
		name: 'iris_position',
		cmd: '\x09\x04\x4B\xFF',
		parse(b) {
			const pos = parse4Nibble(b, 2)
			const label = IRIS_LABELS[pos]
			return { iris_position: pos, iris_label: label ? label + ' (' + pos + ')' : 'Pos ' + pos }
		},
	},
	{
		name: 'shutter_position',
		cmd: '\x09\x04\x4A\xFF',
		parse(b) {
			const pos = parse4Nibble(b, 2)
			const label = SHUTTER_LABELS[pos]
			return { shutter_position: pos, shutter_label: label ? label + ' (' + pos + ')' : 'Pos ' + pos }
		},
	},
	{
		name: 'gain_position',
		cmd: '\x09\x04\x4C\xFF',
		parse(b) {
			return { gain_position: parse4Nibble(b, 2) }
		},
	},
	{
		name: 'wb_mode',
		cmd: '\x09\x04\x35\xFF',
		parse(b) {
			const val = b[2]
			if (WB_MODE_LABELS[val]) return { wb_mode: WB_MODE_LABELS[val] }
			// Color temp positions: 0x0c (2400K) to 0x33 (7100K)
			if (val >= 0x0c && val <= 0x33) {
				const kelvin = Math.round((((val - 12) * 4700) / 39 + 2400) / 100) * 100
				return { wb_mode: 'VAR', color_temp: kelvin + 'K' }
			}
			return { wb_mode: `0x${val.toString(16)}` }
		},
	},
	{
		name: 'rg_position',
		cmd: '\x09\x04\x43\xFF',
		parse(b) {
			return { rg_position: parse4Nibble(b, 2) }
		},
	},
	{
		name: 'bg_position',
		cmd: '\x09\x04\x44\xFF',
		parse(b) {
			return { bg_position: parse4Nibble(b, 2) }
		},
	},
	{
		name: 'backlight',
		cmd: '\x09\x04\x33\xFF',
		parse(b) {
			return { backlight: b[2] === 0x02 ? 'On' : 'Off' }
		},
	},
	{
		name: 'pan_tilt_position',
		cmd: '\x09\x06\x12\xFF',
		parse(b) {
			const pan = parseSigned16(parse4Nibble(b, 2))
			const tilt = parseSigned16(parse4Nibble(b, 6))
			return { pan_position: pan, tilt_position: tilt }
		},
	},
]

class DatavideoViscaInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.ptSpeed = '0C'
		this.ptSpeedIndex = 12
		this.zoomSpeed = '07'
		this.zoomSpeedIndex = 7
		this.inquiryIndex = 0
		this.pendingInquiry = null
		this.recvBuffer = Buffer.alloc(0)

		this.updateStatus(InstanceStatus.Connecting)
		this.initTcp()
		this.updateActions()
		this.updateFeedbacks()
		this.updatePresets()
		this.updateVariableDefinitions()

		this.setVariableValues({
			pt_speed: this.ptSpeedIndex,
			zoom_speed: this.zoomSpeedIndex,
		})
	}

	async configUpdated(config) {
		this.config = config

		clearInterval(this.requestStateInterval)

		if (this.tcp !== undefined) {
			this.tcp.destroy()
			delete this.tcp
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host !== undefined) {
			this.initTcp()
		}
	}

	async destroy() {
		clearInterval(this.requestStateInterval)
		clearTimeout(this.pollAfterCommandTimer)
		this.stopContinuousPolling()
		this.stopPollAll()

		if (this.tcp !== undefined) {
			this.tcp.destroy()
		}

		this.log('debug', 'destroy')
	}

	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module controls Datavideo PTZ cameras and heads with DVIP (Visca over IP) protocol',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Camera IP',
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'DVIP TCP port',
				width: 6,
				default: 5002,
				regex: Regex.PORT,
			},
			{
				type: 'number',
				id: 'deviceAddress',
				label: 'Device Address (1-7)',
				width: 6,
				default: 1,
				min: 1,
				max: 7,
			},
			{
				type: 'checkbox',
				id: 'feedback',
				label: 'Full Status Inquiry',
				default: false,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updatePresets() {
		UpdatePresets(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	initTcp() {
		if (this.tcp !== undefined) {
			this.tcp.destroy()
			delete this.tcp
		}

		if (this.config.host !== undefined) {
			this.tcp = new TCPHelper(this.config.host, this.config.port)

			this.deviceAddress = Buffer.alloc(1)
			this.deviceAddress.writeUInt8(this.config.deviceAddress + 128, 0)

			this.tcp.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.tcp.on('error', (e) => {
				this.log('debug', 'tcp error: ' + e.message)
			})

			this.tcp.on('data', (data) => {
				this.handleData(data)
			})

			this.tcp.on('connect', () => {
				if (this.config.feedback) {
					this.requestStateInterval = setInterval(() => {
						this.requestState()
					}, 1000)
				}
			})

			this.tcp.on('destroy', () => {
				clearInterval(this.requestStateInterval)
			})

			this.log('debug', this.tcp.host + ':' + this.config.port)
		}
	}

	handleData(data) {
		this.recvBuffer = Buffer.concat([this.recvBuffer, data])

		while (this.recvBuffer.length >= 2) {
			const packetLen = this.recvBuffer.readUInt16BE(0)

			if (packetLen < 2) {
				this.recvBuffer = Buffer.alloc(0)
				break
			}

			if (this.recvBuffer.length < packetLen) {
				break
			}

			const packet = this.recvBuffer.subarray(0, packetLen)
			this.recvBuffer = this.recvBuffer.subarray(packetLen)

			this.processPacket(packet)
		}
	}

	processPacket(packet) {
		const visca = packet.subarray(2)
		if (visca.length < 2) return

		const type = visca[1] & 0xf0

		// ACK (x0 4y FF) — ignore
		if (type === 0x40) return

		// Completion (x0 5y FF) with no payload — ignore
		if (type === 0x50 && visca.length === 3) return

		// Inquiry response (x0 50 ... FF) with payload
		if (type === 0x50 && visca.length > 3) {
			if (this.pendingInquiry) {
				const inquiry = this.pendingInquiry
				this.pendingInquiry = null

				try {
					const values = inquiry.parse(visca)
					this.log('debug', `Inquiry ${inquiry.name}: ${JSON.stringify(values)}`)
					this.setVariableValues(values)
					if ('focus_mode' in values) {
						this.checkFeedbacks('focus_mode_manual')
					}
					if ('ae_mode' in values) {
						this.checkFeedbacks('ae_mode_allows_iris', 'ae_mode_allows_shutter', 'ae_mode_manual')
					}
					if ('wb_mode' in values) {
						this.checkFeedbacks('wb_mode_manual', 'wb_mode_onepush', 'wb_mode_var')
					}
					if ('iris_position' in values) {
						this.checkFeedbacks('iris_can_increase', 'iris_can_decrease')
					}
					if ('shutter_position' in values) {
						this.checkFeedbacks('shutter_can_increase', 'shutter_can_decrease')
					}
				} catch (e) {
					this.log('debug', `Failed to parse ${inquiry.name} response: ${e.message}`)
				}
			}
			return
		}

		// Log unrecognised responses
		const hex = visca.toString('hex').match(/../g).join(' ')
		this.log('debug', `Unrecognised packet: ${hex}`)
	}

	sendVISCACommand(str) {
		if (this.tcp !== undefined) {
			let buf = Buffer.from(str, 'binary')
			buf = Buffer.concat([this.deviceAddress, buf])

			this.tcp.send(this.prependPacketSize(buf))

			// Poll the relevant variable shortly after sending a command
			if (this.config.feedback) {
				const cmdBuf = Buffer.from(str, 'binary')
				if (cmdBuf.length >= 4 && cmdBuf[0] === 0x01) {
					const key = cmdBuf[1].toString(16).padStart(2, '0') + '.' + cmdBuf[2].toString(16).padStart(2, '0')
					const inquiryName = COMMAND_TO_INQUIRY[key]
					if (inquiryName) {
						this.pollAfterCommand(inquiryName)
					}
				}
			}
		}
	}

	pauseBackgroundPolling() {
		clearInterval(this.requestStateInterval)
		this.requestStateInterval = null
	}

	resumeBackgroundPolling() {
		if (this.config.feedback && !this.requestStateInterval) {
			this.requestStateInterval = setInterval(() => {
				this.requestState()
			}, 1000)
		}
	}

	startContinuousPolling(inquiryName, interval = 250) {
		this.stopContinuousPolling()
		this.pauseBackgroundPolling()
		const inquiry = INQUIRIES.find((i) => i.name === inquiryName)
		if (inquiry) {
			this.continuousPollingTimer = setInterval(() => {
				this.pendingInquiry = inquiry
				this.sendInquiry(inquiry.cmd)
			}, interval)
		}
	}

	stopContinuousPolling() {
		clearInterval(this.continuousPollingTimer)
		this.continuousPollingTimer = null
		if (!this.pollAllTimer) {
			this.resumeBackgroundPolling()
		}
	}

	pollAllPositions(duration = 5000) {
		this.stopPollAll()
		this.pauseBackgroundPolling()
		const positionInquiries = INQUIRIES.filter((inq) =>
			[
				'zoom_position',
				'focus_position',
				'focus_mode',
				'pan_tilt_position',
				'ae_mode',
				'iris_position',
				'shutter_position',
				'wb_mode',
			].includes(inq.name),
		)
		let i = 0
		const interval = 150
		this.pollAllTimer = setInterval(() => {
			const inquiry = positionInquiries[i % positionInquiries.length]
			this.pendingInquiry = inquiry
			this.sendInquiry(inquiry.cmd)
			i++
		}, interval)
		this.pollAllStopTimer = setTimeout(() => {
			this.stopPollAll()
		}, duration)
	}

	stopPollAll() {
		clearInterval(this.pollAllTimer)
		clearTimeout(this.pollAllStopTimer)
		this.pollAllTimer = null
		this.pollAllStopTimer = null
		if (!this.continuousPollingTimer) {
			this.resumeBackgroundPolling()
		}
	}

	pollAfterCommand(inquiryName, delay = 250) {
		clearTimeout(this.pollAfterCommandTimer)
		this.pauseBackgroundPolling()
		this.pollAfterCommandTimer = setTimeout(() => {
			const inquiry = INQUIRIES.find((i) => i.name === inquiryName)
			if (inquiry) {
				this.pendingInquiry = inquiry
				this.sendInquiry(inquiry.cmd)
			}
			this.resumeBackgroundPolling()
		}, delay)
	}

	sendInquiry(cmd) {
		if (this.tcp !== undefined) {
			let buf = Buffer.from(cmd, 'binary')
			buf = Buffer.concat([this.deviceAddress, buf])
			this.tcp.send(this.prependPacketSize(buf))
		}
	}

	prependPacketSize(cmd) {
		const cmdsize = Buffer.byteLength(cmd) + 2
		const pktsize = Buffer.alloc(2)
		pktsize.writeUInt16LE(cmdsize, 0)
		cmd = Buffer.concat([pktsize.swap16(), cmd])
		return cmd
	}

	requestState() {
		const inquiry = INQUIRIES[this.inquiryIndex]
		this.pendingInquiry = inquiry
		this.inquiryIndex = (this.inquiryIndex + 1) % INQUIRIES.length

		this.sendInquiry(inquiry.cmd)
	}

	getPanTiltSpeeds() {
		const panspeed = String.fromCharCode(parseInt(this.ptSpeed, 16) & 0xff)
		const tiltspeed = String.fromCharCode(Math.min(parseInt(this.ptSpeed, 16), 0x14) & 0xff)
		return { panspeed, tiltspeed }
	}
}

runEntrypoint(DatavideoViscaInstance, UpgradeScripts)
