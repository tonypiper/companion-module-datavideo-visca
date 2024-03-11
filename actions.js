import { ActionId, PRESET, SPEED, CHOICE_ZOOMSPEED, IRIS, SHUTTER } from './constants.js'

export function getActions(instance) {
	const panspeed = String.fromCharCode(parseInt(instance.ptSpeed, 16) & 0xff)
	const tiltspeed = String.fromCharCode(Math.min(parseInt(instance.ptSpeed, 16), 0x14) & 0xff)

	return {
		[ActionId.left]: {
			name: 'Pan Left',
			callback: async (_action) => {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x01\x03\xFF`
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.right]: {
			name: 'Pan Right',
			callback: async (_action) => {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x02\x03\xFF`
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.up]: {
			name: 'Tilt Up',
			callback: async (_action) => {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x03\x01\xFF`
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.down]: {
			name: 'Tilt Down',
			callback: async (_action) => {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x03\x02\xFF`
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.upLeft]: {
			name: 'Up Left',
			callback: async (_action) => {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x01\x01\xFF`
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.upRight]: {
			name: 'Up Right',
			callback: async (_action) => {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x02\x01\xFF`
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.downLeft]: {
			name: 'Down Left',
			callback: async (_action) => {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x01\x02\xFF`
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.downRight]: {
			name: 'Down Right',
			callback: async (_action) => {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x02\x02\xFF`
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.stop]: {
			name: 'P/T Stop',
			callback: async (_action) => {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x03\x03\xFF`
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.home]: {
			name: 'P/T Home',
			callback: async (_action) => {
				const cmd = '\x01\x06\x04\xFF'
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.ptSpeedS]: {
			name: 'P/T Speed',
			options: [
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: SPEED,
				},
			],
			callback: async (action) => {
				instance.ptSpeed = action.options.speed

				let idx = -1
				for (let i = 0; i < SPEED.length; ++i) {
					if (SPEED[i].id == instance.ptSpeed) {
						idx = i
						break
					}
				}
				if (idx > -1) {
					instance.ptSpeedIndex = idx
				}
				instance.debug(`${instance.ptSpeed} == ${instance.ptSpeedIndex}`)
			},
		},
		[ActionId.ptSpeedU]: {
			name: 'P/T Speed Up',
			callback: async (_action) => {
				if (instance.ptSpeedIndex == 23) {
					instance.ptSpeedIndex = 23
				} else if (instance.ptSpeedIndex < 23) {
					instance.ptSpeedIndex++
				}
				instance.ptSpeed = SPEED[instance.ptSpeedIndex].id
			},
			options: [],
		},
		[ActionId.ptSpeedD]: {
			name: 'P/T Speed Down',
			callback: async (_action) => {
				if (instance.ptSpeedIndex == 0) {
					instance.ptSpeedIndex = 0
				} else if (instance.ptSpeedIndex > 0) {
					instance.ptSpeedIndex--
				}
				instance.ptSpeed = SPEED[instance.ptSpeedIndex].id
			},
			options: [],
		},
		[ActionId.ptSlow]: {
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
				},
			],
			callback: async (_action) => {},
		},
		[ActionId.zoomI]: {
			name: 'Zoom In',
			callback: async (_action) => {
				const zoomspeed = String.fromCharCode((parseInt(instance.zoomSpeed, 16) + 32) & 0xff)

				const cmd = `\x01\x04\x07${zoomspeed}\xff`
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.zoomO]: {
			name: 'Zoom Out',
			callback: async (_action) => {
				//Variable zoom speed
				const zoomspeed = String.fromCharCode((parseInt(instance.zoomSpeed, 16) + 48) & 0xff)

				const cmd = `\x01\x04\x07${zoomspeed}\xff`
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.zoomS]: {
			name: 'Zoom Stop',
			callback: async (_action) => {
				const cmd = '\x01\x04\x07\x00\xFF'
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.zoomSpeedS]: {
			name: 'Zoom Speed',
			options: [
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: CHOICE_ZOOMSPEED,
				},
			],
			callback: async (action) => {
				instance.zoomSpeed = action.options.speed

				let idx = -1
				for (let i = 0; i < CHOICE_ZOOMSPEED.length; ++i) {
					if (CHOICE_ZOOMSPEED[i].id == instance.zoomSpeed) {
						idx = i
						break
					}
				}
				if (idx > -1) {
					instance.zoomSpeedIndex = idx
				}
				instance.debug(`${instance.zoomSpeed} == ${instance.zoomSpeedIndex}`)
			},
		},
		[ActionId.zoomSpeedU]: {
			name: 'Zoom Speed Up',
			callback: async (_action) => {
				if (instance.zoomSpeedIndex == 7) {
					instance.zoomSpeedIndex = 7
				} else if (instance.zoomSpeedIndex < 7) {
					instance.zoomSpeedIndex++
				}
				instance.zoomSpeed = CHOICE_ZOOMSPEED[instance.zoomSpeedIndex].id
			},
			options: [],
		},
		[ActionId.zoomSpeedD]: {
			name: 'Zoom Speed Down',
			callback: async (_action) => {
				if (instance.zoomSpeedIndex == 1) {
					instance.zoomSpeedIndex = 1
				} else if (instance.zoomSpeedIndex > 0) {
					instance.zoomSpeedIndex--
				}
				instance.zoomSpeed = CHOICE_ZOOMSPEED[instance.zoomSpeedIndex].id
			},
			options: [],
		},
		[ActionId.zoomTime]: {
			name: 'Zoom Postion In/Out (ms)',
			options: [
				{
					type: 'number',
					label: 'Zoom In (ms)',
					id: 'zIn',
					default: 2500,
					min: 0,
					max: 99_999,
				},
				{
					type: 'number',
					label: 'Zoom Out (ms)',
					id: 'zOut',
					default: 1000,
					min: 0,
					max: 99_999,
				},
			],
			callback: async (action) => {
				//For heads that do not support direct Zoom control

				//Zoom in for ms
				const cmd = '\x01\x04\x07\x27\xff'
				instance.sendVISCACommand(cmd)

				setTimeout(() => {
					//Zoom out for ms
					const cmd = '\x01\x04\x07\x37\xff'
					instance.sendVISCACommand(cmd)
					setTimeout(() => {
						//Stop
						const cmd = '\x01\x04\x07\x00\xFF'
						instance.sendVISCACommand(cmd)
					}, action.options.zOut)
				}, action.options.zIn)
			},
		},
		[ActionId.zInMs]: {
			name: 'Zoom In for ms',
			options: [
				{
					type: 'number',
					label: 'Zoom In (ms)',
					id: 'ms',
					default: 1000,
					min: 0,
					max: 99_999,
				},
			],
			callback: async (action) => {
				//Zoom in for ms
				const cmd = '\x01\x04\x07\x27\xff'
				instance.sendVISCACommand(cmd)

				setTimeout(() => {
					//Stop
					const cmd = '\x01\x04\x07\x00\xFF'
					instance.sendVISCACommand(cmd)
				}, action.options.ms)
			},
		},
		[ActionId.zOutMs]: {
			name: 'Zoom Out for ms',
			options: [
				{
					type: 'number',
					label: 'Zoom Out (ms)',
					id: 'ms',
					default: 1000,
					min: 0,
					max: 99_999,
				},
			],
			callback: async (action) => {
				//Zoom out for ms
				const cmd = '\x01\x04\x07\x37\xff'
				instance.sendVISCACommand(cmd)

				setTimeout(() => {
					//Stop
					const cmd = '\x01\x04\x07\x00\xFF'
					instance.sendVISCACommand(cmd)
				}, action.options.ms)
			},
		},
		[ActionId.focusN]: {
			name: 'Focus Near',
			callback: async (_action) => {
				const cmd = '\x01\x04\x08\x03\xFF'
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.focusF]: {
			name: 'Focus Far',
			callback: async (_action) => {
				const cmd = '\x01\x04\x08\x02\xFF'
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.focusS]: {
			name: 'Focus Stop',
			callback: async (_action) => {
				const cmd = '\x01\x04\x08\x00\xFF'
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.focusM]: {
			label: 'Focus Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Auto / Manual Focus',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Auto Focus' },
						{ id: '1', label: 'Manual Focus' },
					],
				},
			],
			callback: async (action) => {
				let cmd
				if (action.options.bol == 0) {
					cmd = '\x01\x04\x38\x02\xFF'
				}
				if (action.options.bol == 1) {
					cmd = '\x01\x04\x38\x03\xFF'
				}
				instance.sendVISCACommand(cmd)
			},
		},
		[ActionId.expM]: {
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
				},
			],
			callback: async (action) => {
				let cmd
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
				instance.sendVISCACommand(cmd)
			},
		},
		[ActionId.irisU]: {
			name: 'Iris Up',
			callback: async (_action) => {
				const cmd = '\x01\x04\x0B\x02\xFF'
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.irisD]: {
			name: 'Iris Down',
			callback: async (_action) => {
				const cmd = '\x01\x04\x0B\x03\xFF'
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.irisS]: {
			name: 'Set Iris',
			options: [
				{
					type: 'dropdown',
					label: 'Iris setting',
					id: 'val',
					choices: IRIS,
				},
			],
			callback: async (action) => {
				const cmd = Buffer.from('\x01\x04\x4B\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(action.options.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(action.options.val, 16) & 0x0f, 7)
				instance.sendVISCACommand(cmd)
				instance.debug('cmd=', cmd)
			},
		},
		[ActionId.shutU]: {
			name: 'Shutter Up',
			callback: async (_action) => {
				const cmd = '\x01\x04\x0A\x02\xFF'
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.shutD]: {
			name: 'Shutter Down',
			callback: async (_action) => {
				const cmd = '\x01\x04\x0A\x03\xFF'
				instance.sendVISCACommand(cmd)
			},
			options: [],
		},
		[ActionId.shutS]: {
			label: 'Set Shutter',
			options: [
				{
					type: 'dropdown',
					label: 'Shutter setting',
					id: 'val',
					choices: SHUTTER,
				},
			],
			callback: async (action) => {
				const cmd = Buffer.from('\x01\x04\x4A\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(action.options.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(action.options.val, 16) & 0x0f, 7)
				instance.sendVISCACommand(cmd)
				instance.debug('cmd=', cmd)
			},
		},
		[ActionId.savePset]: {
			name: 'Save Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: PRESET,
				},
			],
			callback: async (action) => {
				const cmd = `\x01\x04\x3F\x01${String.fromCharCode(parseInt(action.options.val, 16) & 0xff)}\xFF`
				instance.sendVISCACommand(cmd)
			},
		},
		[ActionId.recallPset]: {
			name: 'Recall Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: PRESET,
				},
			],
			callback: async (action) => {
				const cmd = `\x01\x04\x3F\x02${String.fromCharCode(parseInt(action.options.val, 16) & 0xff)}\xFF`
				instance.sendVISCACommand(cmd)
			},
		},
		[ActionId.custom]: {
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
			callback: async (action) => {
				const hexData = action.options.custom.replace(/\s+/g, '')
				const tempBuffer = Buffer.from(hexData, 'hex')
				const cmd = tempBuffer.toString('binary')

				instance.sendVISCACommand(cmd)
			},
		},
		[ActionId.tally]: {
			name: 'Tally Colour',
			options: [
				{
					type: 'dropdown',
					label: 'Colour setting',
					id: 'val',
					default: 0,
					choices: [
						{ id: '0', label: 'Red' },
						{ id: '1', label: 'Green' },
						{ id: '2', label: 'Off' },
					],
				},
			],
			callback: async (action) => {
				let cmd
				if (action.options.val == 0) {
					cmd = '\x01\x7E\x01\x0A\x00\x02\x03\xFF'
				}
				if (action.options.val == 1) {
					cmd = '\x01\x7E\x01\x0A\x00\x03\x02\xFF'
				}
				if (action.options.val == 2) {
					cmd = '\x01\x7E\x01\x0A\x00\x03\x03\xFF'
				}
				instance.sendVISCACommand(cmd)
			},
		},
		[ActionId.speedPset]: {
			name: 'Preset Drive Speed',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: PRESET,
				},
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: SPEED,
				},
			],
			callback: async (action) => {
				const cmd = `\x01\x7E\x01\x0B${String.fromCharCode(parseInt(action.options.val, 16) & 0xff)}${String.fromCharCode(parseInt(action.options.speed, 16) & 0xff)}\xFF`
				instance.sendVISCACommand(cmd)
			},
		},
		[ActionId.osd]: {
			name: 'OSD Controls',
			options: [
				{
					type: 'dropdown',
					label: 'OSD button',
					id: 'val',
					default: 0,
					choices: [
						{ id: '0', label: 'OSD ON' },
						{ id: '1', label: 'OSD OFF' },
						{ id: '2', label: 'ENTER' },
						{ id: '3', label: 'BACK' },
						{ id: '4', label: 'UP' },
						{ id: '5', label: 'DOWN' },
						{ id: '6', label: 'LEFT' },
						{ id: '7', label: 'RIGHT' },
						{ id: '8', label: 'STOP' },
					],
				},
			],
			callback: async (action) => {
				let cmd
				switch (action.options.val) {
					case 0:
						//OSD ON
						cmd = '\x01\x06\x06\x02\xff'
						break
					case 1:
						//OSD OFF
						cmd = '\x01\x06\x06\x03\xff'
						break
					case 2:
						//ENTER
						cmd = '\x01\x7e\x01\x02\x00\x01\xff'
						break
					case 3:
						//BACK
						cmd = '\x01\x06\x01\x09\x09\x01\x03\xff'
						break
					case 4:
						//UP
						cmd = '\x01\x06\x01\x0a\x0a\x03\x01\xff'
						break
					case 5:
						//DOWN
						cmd = '\x01\x06\x01\x0a\x0a\x03\x02\xff'
						break
					case 6:
						//LEFT
						cmd = '\x01\x06\x01\x0a\x0a\x01\x03\xff'
						break
					case 7:
						//RIGHT
						cmd = '\x01\x06\x01\x0a\x0a\x02\x03\xff'
						break
					case 8:
						//RELEASE/STOP
						cmd = '\x01\x06\x01\x01\x01\x03\x03\xff'
						break
				}
				instance.sendVISCACommand(cmd)
			},
		},
	}
}
