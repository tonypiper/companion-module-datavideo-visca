const IRIS = [
	{ id: '11', label: 'F1.8' },
	{ id: '10', label: 'F2.0' },
	{ id: '0F', label: 'F2.4' },
	{ id: '0E', label: 'F2.8' },
	{ id: '0D', label: 'F3.4' },
	{ id: '0C', label: 'F4.0' },
	{ id: '0B', label: 'F4.8' },
	{ id: '0A', label: 'F5.6' },
	{ id: '09', label: 'F6.8' },
	{ id: '08', label: 'F8.0' },
	{ id: '07', label: 'F9.6' },
	{ id: '06', label: 'F11' },
	{ id: '00', label: 'CLOSED' },
]

const SHUTTER = [
	{ id: '11', label: '1/1000000' },
	{ id: '10', label: '1/6000' },
	{ id: '0F', label: '1/4000' },
	{ id: '0E', label: '1/3000' },
	{ id: '0D', label: '1/2000' },
	{ id: '0C', label: '1/1500' },
	{ id: '0B', label: '1/1000' },
	{ id: '0A', label: '1/725' },
	{ id: '09', label: '1/500' },
	{ id: '08', label: '1/350' },
	{ id: '07', label: '1/250' },
	{ id: '06', label: '1/180' },
	{ id: '05', label: '1/125' },
	{ id: '04', label: '1/100' },
	{ id: '03', label: '1/90' },
	{ id: '02', label: '1/60' },
	{ id: '01', label: '1/30' },
]

const PRESET = []
for (let i = 0; i < 64; ++i) {
	PRESET.push({ id: ('0' + i.toString(16)).substr(-2, 2), label: 'Preset ' + i })
}

const SPEED = [
	{ id: '01', label: 'Speed 01 (Slow)' },
	{ id: '02', label: 'Speed 02' },
	{ id: '03', label: 'Speed 03' },
	{ id: '04', label: 'Speed 04' },
	{ id: '05', label: 'Speed 05' },
	{ id: '06', label: 'Speed 06' },
	{ id: '07', label: 'Speed 07' },
	{ id: '08', label: 'Speed 08' },
	{ id: '09', label: 'Speed 09' },
	{ id: '0A', label: 'Speed 10' },
	{ id: '0B', label: 'Speed 11' },
	{ id: '0C', label: 'Speed 12' },
	{ id: '0D', label: 'Speed 13' },
	{ id: '0E', label: 'Speed 14' },
	{ id: '0F', label: 'Speed 15' },
	{ id: '10', label: 'Speed 16' },
	{ id: '11', label: 'Speed 17' },
	{ id: '12', label: 'Speed 18' },
	{ id: '13', label: 'Speed 19' },
	{ id: '14', label: 'Speed 20' },
	{ id: '15', label: 'Speed 21' },
	{ id: '16', label: 'Speed 22' },
	{ id: '17', label: 'Speed 23' },
	{ id: '18', label: 'Speed 24 (Fast)' },
]

const CHOICE_ZOOMSPEED = [
	{ id: '00', label: 'Speed 00 (Default)' },
	{ id: '01', label: 'Speed 01 (Slow)' },
	{ id: '02', label: 'Speed 02' },
	{ id: '03', label: 'Speed 03' },
	{ id: '04', label: 'Speed 04' },
	{ id: '05', label: 'Speed 05' },
	{ id: '06', label: 'Speed 06' },
	{ id: '07', label: 'Speed 07 (Fast)' },
]

module.exports = function (self) {
	self.setActionDefinitions({
		left: {
			name: 'Pan Left',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x01\x03\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		right: {
			name: 'Pan Right',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x02\x03\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		up: {
			name: 'Tilt Up',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x03\x01\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		down: {
			name: 'Tilt Down',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x03\x02\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		upLeft: {
			name: 'Up Left',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x01\x01\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		upRight: {
			name: 'Up Right',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x02\x01\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		downLeft: {
			name: 'Down Left',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x01\x02\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		downRight: {
			name: 'Down Right',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x02\x02\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		stop: {
			name: 'P/T Stop',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x03\x03\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		home: {
			name: 'P/T Home',
			options: [],
			callback: () => {
				const cmd = '\x01\x06\x04\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		ptSpeedS: {
			name: 'P/T Speed',
			options: [
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: SPEED,
					default: SPEED[0].id,
				},
			],
			callback: (action) => {
				self.ptSpeed = action.options.speed

				let idx = -1
				for (let i = 0; i < SPEED.length; ++i) {
					if (SPEED[i].id == self.ptSpeed) {
						idx = i
						break
					}
				}
				if (idx > -1) {
					self.ptSpeedIndex = idx
				}
				self.log('debug', self.ptSpeed + ' == ' + self.ptSpeedIndex)
				self.setVariableValues({ pt_speed: self.ptSpeedIndex })
			},
		},
		ptSpeedU: {
			name: 'P/T Speed Up',
			options: [],
			callback: () => {
				if (self.ptSpeedIndex < 23) {
					self.ptSpeedIndex++
				}
				self.ptSpeed = SPEED[self.ptSpeedIndex].id
				self.setVariableValues({ pt_speed: self.ptSpeedIndex })
			},
		},
		ptSpeedD: {
			name: 'P/T Speed Down',
			options: [],
			callback: () => {
				if (self.ptSpeedIndex > 0) {
					self.ptSpeedIndex--
				}
				self.ptSpeed = SPEED[self.ptSpeedIndex].id
				self.setVariableValues({ pt_speed: self.ptSpeedIndex })
			},
		},
		ptSlow: {
			name: 'P/T Slow Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Slow Mode On/Off',
					id: 'bol',
					choices: [
						{ id: '1', label: 'Off' },
						{ id: '0', label: 'On' },
					],
					default: '1',
				},
			],
			callback: (_action) => {
				// ptSlow had no action handler in original
			},
		},
		zoomI: {
			name: 'Zoom In',
			options: [],
			callback: () => {
				const zoomspeed = String.fromCharCode((parseInt(self.zoomSpeed, 16) + 32) & 0xff)
				const cmd = '\x01\x04\x07' + zoomspeed + '\xff'
				self.sendVISCACommand(cmd)
			},
		},
		zoomO: {
			name: 'Zoom Out',
			options: [],
			callback: () => {
				const zoomspeed = String.fromCharCode((parseInt(self.zoomSpeed, 16) + 48) & 0xff)
				const cmd = '\x01\x04\x07' + zoomspeed + '\xff'
				self.sendVISCACommand(cmd)
			},
		},
		zoomS: {
			name: 'Zoom Stop',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x07\x00\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		zoomSpeedS: {
			name: 'Zoom Speed',
			options: [
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: CHOICE_ZOOMSPEED,
					default: CHOICE_ZOOMSPEED[0].id,
				},
			],
			callback: (action) => {
				self.zoomSpeed = action.options.speed

				let idx = -1
				for (let i = 0; i < CHOICE_ZOOMSPEED.length; ++i) {
					if (CHOICE_ZOOMSPEED[i].id == self.zoomSpeed) {
						idx = i
						break
					}
				}
				if (idx > -1) {
					self.zoomSpeedIndex = idx
				}
				self.log('debug', self.zoomSpeed + ' == ' + self.zoomSpeedIndex)
				self.setVariableValues({ zoom_speed: self.zoomSpeedIndex })
			},
		},
		zoomSpeedU: {
			name: 'Zoom Speed Up',
			options: [],
			callback: () => {
				if (self.zoomSpeedIndex < 7) {
					self.zoomSpeedIndex++
				}
				self.zoomSpeed = CHOICE_ZOOMSPEED[self.zoomSpeedIndex].id
				self.setVariableValues({ zoom_speed: self.zoomSpeedIndex })
			},
		},
		zoomSpeedD: {
			name: 'Zoom Speed Down',
			options: [],
			callback: () => {
				if (self.zoomSpeedIndex > 0) {
					self.zoomSpeedIndex--
				}
				self.zoomSpeed = CHOICE_ZOOMSPEED[self.zoomSpeedIndex].id
				self.setVariableValues({ zoom_speed: self.zoomSpeedIndex })
			},
		},
		zoomTime: {
			name: 'Zoom Postion In/Out (ms)',
			options: [
				{
					type: 'number',
					label: 'Zoom In (ms)',
					id: 'zIn',
					default: 2500,
					min: 0,
					max: 99999,
				},
				{
					type: 'number',
					label: 'Zoom Out (ms)',
					id: 'zOut',
					default: 1000,
					min: 0,
					max: 99999,
				},
			],
			callback: (action) => {
				const opt = action.options
				// Zoom in for ms
				let cmd = '\x01\x04\x07\x27\xff'
				self.sendVISCACommand(cmd)

				setTimeout(() => {
					// Zoom out for ms
					cmd = '\x01\x04\x07\x37\xff'
					self.sendVISCACommand(cmd)
					setTimeout(() => {
						// Stop
						cmd = '\x01\x04\x07\x00\xFF'
						self.sendVISCACommand(cmd)
					}, opt.zOut)
				}, opt.zIn)
			},
		},
		zInMS: {
			name: 'Zoom In for ms',
			options: [
				{
					type: 'number',
					label: 'Zoom In (ms)',
					id: 'ms',
					default: 1000,
					min: 0,
					max: 99999,
				},
			],
			callback: (action) => {
				const cmd = '\x01\x04\x07\x27\xff'
				self.sendVISCACommand(cmd)

				setTimeout(() => {
					const stopCmd = '\x01\x04\x07\x00\xFF'
					self.sendVISCACommand(stopCmd)
				}, action.options.ms)
			},
		},
		zOutMS: {
			name: 'Zoom Out for ms',
			options: [
				{
					type: 'number',
					label: 'Zoom Out (ms)',
					id: 'ms',
					default: 1000,
					min: 0,
					max: 99999,
				},
			],
			callback: (action) => {
				const cmd = '\x01\x04\x07\x37\xff'
				self.sendVISCACommand(cmd)

				setTimeout(() => {
					const stopCmd = '\x01\x04\x07\x00\xFF'
					self.sendVISCACommand(stopCmd)
				}, action.options.ms)
			},
		},
		focusN: {
			name: 'Focus Near',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x08\x03\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		focusF: {
			name: 'Focus Far',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x08\x02\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		focusS: {
			name: 'Focus Stop',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x08\x00\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		focusM: {
			name: 'Focus Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Auto / Manual Focus',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Auto Focus' },
						{ id: '1', label: 'Manual Focus' },
					],
					default: '0',
				},
			],
			callback: (action) => {
				self.setVariableValues({ focus_mode: action.options.bol == 0 ? 'Auto' : 'Manual' })
				let cmd = ''
				if (action.options.bol == 0) {
					cmd = '\x01\x04\x38\x02\xFF'
				}
				if (action.options.bol == 1) {
					cmd = '\x01\x04\x38\x03\xFF'
				}
				self.sendVISCACommand(cmd)
			},
		},
		expM: {
			name: 'Exposure Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode setting',
					id: 'val',
					choices: [
						{ id: '0', label: 'Full auto' },
						{ id: '1', label: 'Manual' },
						{ id: '2', label: 'Shutter Pri' },
						{ id: '3', label: 'Iris Pri' },
						{ id: '4', label: 'Bright mode (manual)' },
					],
					default: '0',
				},
			],
			callback: (action) => {
				const labels = { 0: 'Auto', 1: 'Manual', 2: 'Shutter', 3: 'Iris', 4: 'Bright' }
				self.setVariableValues({ ae_mode: labels[action.options.val] || action.options.val.toString() })
				let cmd = ''
				if (action.options.val == 0) {
					cmd = '\x01\x04\x39\x00\xFF'
				}
				if (action.options.val == 1) {
					cmd = '\x01\x04\x39\x03\xFF'
				}
				if (action.options.val == 2) {
					cmd = '\x01\x04\x39\x0A\xFF'
				}
				if (action.options.val == 3) {
					cmd = '\x01\x04\x39\x0B\xFF'
				}
				if (action.options.val == 4) {
					cmd = '\x01\x04\x39\x0D\xFF'
				}
				self.sendVISCACommand(cmd)
			},
		},
		irisU: {
			name: 'Iris Up',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x0B\x02\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		irisD: {
			name: 'Iris Down',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x0B\x03\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		irisS: {
			name: 'Set Iris',
			options: [
				{
					type: 'dropdown',
					label: 'Iris setting',
					id: 'val',
					choices: IRIS,
					default: IRIS[0].id,
				},
			],
			callback: (action) => {
				self.setVariableValues({ iris_position: parseInt(action.options.val, 16) })
				const cmd = Buffer.from('\x01\x04\x4B\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(action.options.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(action.options.val, 16) & 0x0f, 7)
				self.sendVISCACommand(cmd)
			},
		},
		shutU: {
			name: 'Shutter Up',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x0A\x02\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		shutD: {
			name: 'Shutter Down',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x0A\x03\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		shutS: {
			name: 'Set Shutter',
			options: [
				{
					type: 'dropdown',
					label: 'Shutter setting',
					id: 'val',
					choices: SHUTTER,
					default: SHUTTER[0].id,
				},
			],
			callback: (action) => {
				self.setVariableValues({ shutter_position: parseInt(action.options.val, 16) })
				const cmd = Buffer.from('\x01\x04\x4A\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(action.options.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(action.options.val, 16) & 0x0f, 7)
				self.sendVISCACommand(cmd)
			},
		},
		gainU: {
			name: 'Gain Up',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x0C\x02\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		gainD: {
			name: 'Gain Down',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x0C\x03\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		gainR: {
			name: 'Gain Reset',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x0C\x00\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		wbM: {
			name: 'White Balance Mode',
			options: [
				{
					type: 'dropdown',
					label: 'WB Mode',
					id: 'val',
					choices: [
						{ id: '0', label: 'Auto' },
						{ id: '1', label: 'Indoor' },
						{ id: '2', label: 'Outdoor' },
						{ id: '3', label: 'One Push' },
						{ id: '4', label: 'VAR' },
						{ id: '5', label: 'Manual' },
					],
					default: '0',
				},
			],
			callback: (action) => {
				const mode = parseInt(action.options.val, 10)
				const labels = { 0: 'Auto', 1: 'Indoor', 2: 'Outdoor', 3: 'OnePush', 4: 'VAR', 5: 'Manual' }
				self.setVariableValues({ wb_mode: labels[mode] || mode.toString() })
				const cmd = '\x01\x04\x35' + String.fromCharCode(mode) + '\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		wbOnePush: {
			name: 'WB One Push Trigger',
			options: [],
			callback: () => {
				const cmd = '\x01\x04\x10\x05\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		colorTemp: {
			name: 'Color Temperature (K)',
			options: [
				{
					type: 'number',
					label: 'Temperature (K)',
					id: 'val',
					default: 5000,
					min: 2400,
					max: 7100,
					step: 100,
				},
			],
			callback: (action) => {
				const kelvin = parseInt(action.options.val, 10)
				// Map Kelvin to camera position byte: 0x0c (2400K) to 0x33 (7100K)
				const pos = Math.round((kelvin - 2400) * 39 / 4700) + 12
				const cmd = '\x01\x04\x35' + String.fromCharCode(pos) + '\xFF'
				self.setVariableValues({ wb_mode: 'VAR', color_temp: kelvin + 'K' })
				self.sendVISCACommand(cmd)
			},
		},
		rgU: {
			name: 'Red Gain Up',
			options: [],
			callback: () => {
				self.sendVISCACommand('\x01\x04\x03\x02\xFF')
			},
		},
		rgD: {
			name: 'Red Gain Down',
			options: [],
			callback: () => {
				self.sendVISCACommand('\x01\x04\x03\x03\xFF')
			},
		},
		rgR: {
			name: 'Red Gain Reset',
			options: [],
			callback: () => {
				self.sendVISCACommand('\x01\x04\x03\x00\xFF')
			},
		},
		bgU: {
			name: 'Blue Gain Up',
			options: [],
			callback: () => {
				self.sendVISCACommand('\x01\x04\x04\x02\xFF')
			},
		},
		bgD: {
			name: 'Blue Gain Down',
			options: [],
			callback: () => {
				self.sendVISCACommand('\x01\x04\x04\x03\xFF')
			},
		},
		bgR: {
			name: 'Blue Gain Reset',
			options: [],
			callback: () => {
				self.sendVISCACommand('\x01\x04\x04\x00\xFF')
			},
		},
		savePset: {
			name: 'Save Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: PRESET,
					default: PRESET[0].id,
				},
			],
			callback: (action) => {
				const cmd = '\x01\x04\x3F\x01' + String.fromCharCode(parseInt(action.options.val, 16) & 0xff) + '\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		recallPset: {
			name: 'Recall Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: PRESET,
					default: PRESET[0].id,
				},
			],
			callback: (action) => {
				const cmd = '\x01\x04\x3F\x02' + String.fromCharCode(parseInt(action.options.val, 16) & 0xff) + '\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		custom: {
			name: 'Custom command',
			options: [
				{
					type: 'textinput',
					label: 'Custom command, must start with 8',
					id: 'custom',
					regex: '/^8[0-9a-fA-F]\\s*([0-9a-fA-F]\\s*)+$/',
					width: 6,
				},
			],
			callback: (action) => {
				const hexData = action.options.custom.replace(/\s+/g, '')
				const tempBuffer = Buffer.from(hexData, 'hex')
				const cmd = tempBuffer.toString('binary')
				self.sendVISCACommand(cmd)
			},
		},
		tally: {
			name: 'Tally Colour',
			options: [
				{
					type: 'dropdown',
					label: 'Colour setting',
					id: 'val',
					default: '0',
					choices: [
						{ id: '0', label: 'Red' },
						{ id: '1', label: 'Green' },
						{ id: '2', label: 'Off' },
					],
				},
			],
			callback: (action) => {
				let cmd = ''
				if (action.options.val == 0) {
					cmd = '\x01\x7E\x01\x0A\x00\x02\x03\xFF'
				}
				if (action.options.val == 1) {
					cmd = '\x01\x7E\x01\x0A\x00\x03\x02\xFF'
				}
				if (action.options.val == 2) {
					cmd = '\x01\x7E\x01\x0A\x00\x03\x03\xFF'
				}
				self.sendVISCACommand(cmd)
			},
		},
		speedPset: {
			name: 'Preset Drive Speed',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: PRESET,
					default: PRESET[0].id,
				},
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: SPEED,
					default: SPEED[0].id,
				},
			],
			callback: (action) => {
				const cmd =
					'\x01\x7E\x01\x0B' +
					String.fromCharCode(parseInt(action.options.val, 16) & 0xff) +
					String.fromCharCode(parseInt(action.options.speed, 16) & 0xff) +
					'\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		osd: {
			name: 'OSD Controls',
			options: [
				{
					type: 'dropdown',
					label: 'OSD button',
					id: 'val',
					default: 0,
					choices: [
						{ id: 0, label: 'OSD ON' },
						{ id: 1, label: 'OSD OFF' },
						{ id: 2, label: 'ENTER' },
						{ id: 3, label: 'BACK' },
						{ id: 4, label: 'UP' },
						{ id: 5, label: 'DOWN' },
						{ id: 6, label: 'LEFT' },
						{ id: 7, label: 'RIGHT' },
						{ id: 8, label: 'STOP' },
					],
				},
			],
			callback: (action) => {
				let cmd = ''
				switch (action.options.val) {
					case 0:
						cmd = '\x01\x06\x06\x02\xff'
						break
					case 1:
						cmd = '\x01\x06\x06\x03\xff'
						break
					case 2:
						cmd = '\x01\x7e\x01\x02\x00\x01\xff'
						break
					case 3:
						cmd = '\x01\x06\x01\x09\x09\x01\x03\xff'
						break
					case 4:
						cmd = '\x01\x06\x01\x0a\x0a\x03\x01\xff'
						break
					case 5:
						cmd = '\x01\x06\x01\x0a\x0a\x03\x02\xff'
						break
					case 6:
						cmd = '\x01\x06\x01\x0a\x0a\x01\x03\xff'
						break
					case 7:
						cmd = '\x01\x06\x01\x0a\x0a\x02\x03\xff'
						break
					case 8:
						cmd = '\x01\x06\x01\x01\x01\x03\x03\xff'
						break
				}
				self.sendVISCACommand(cmd)
			},
		},
	})
}
