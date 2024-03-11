import { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } from '@companion-module/base'
import UpgradeScripts from './upgrades.js'
import { IRIS, SHUTTER, SPEED, CHOICE_ZOOMSPEED, COLOR, IMAGE } from './constants.js'

const ok_pkt = Buffer.from([0x00, 0x08, 0x81, 0x09, 0x7e, 0x7e, 0x70, 0xff])

const PRESET = []
for (let i = 0; i < 64; ++i) {
	PRESET.push({ id: `0${i.toString(16)}`.slice(-2), label: `Preset ${i}` })
}

class ModuleInstance extends InstanceBase {
	request_state
	config = {}
	ptSpeed = '0C'
	ptSpeedIndex = 12
	zoomSpeed = '07'
	zoomSpeedIndex = 7

	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Connecting, 'Connecting')

		this.init_tcp()
		this.updateStatus(InstanceStatus.Ok, 'Ready')
		this.updateActions()
		// this.updateFeedbacks() - there aren't any feedbacks yet defined
		this.init_presets()
		this.updateVariables()
	}

	init_tcp() {
		if (this.tcp !== undefined) {
			this.tcp.destroy()
			delete this.tcp
		}

		if (this.config.host === undefined) {
			return
		}
		this.tcp = new TCPHelper(this.config.host, this.config.port)

		this.deviceAddress = Buffer.alloc(1)
		this.deviceAddress.writeUInt8(this.config.deviceAddress + 128, 0)

		this.tcp.on('status_change', (status, message) => {
			this.status(status, message)
		})

		this.tcp.on('error', (e) => {
			this.debug('tcp error:', e.message)
		})

		this.tcp.on('data', (data) => {
			//Ignore the ok response
			if (!data.equals(ok_pkt)) {
				this.debug('Data from Datavideo VISCA: ', data)
			}
		})

		this.tcp.on('connect', () => {
			//Set slower zoom speed
			//var connect_packet = '\x01\x7e\x01\x0b\x7e\x02\xff';
			//self.sendVISCACommand(connect_packet);

			if (this.config.feedback) {
				this.request_state = setInterval(() => {
					this.requestState()
				}, 1000)
			}
		})

		this.tcp.on('destroy', () => {
			clearInterval(this.request_state)
		})

		this.debug(`${this.tcp.host}:${this.config.port}`)
	}

	getVariables() {
		return [
			{
				label: 'Pan/Tilt Speed',
				name: 'pt_speed',
			},
			{
				label: 'Zoom Speed',
				name: 'zoom_speed',
			},
		]
	}

	async configUpdated(config) {
		this.config = config

		clearInterval(this.request_state)

		if (this.tcp !== undefined) {
			this.tcp.destroy()
			delete this.tcp
		}

		this.status(this.STATUS_UNKNOWN)

		if (this.config.host !== undefined) {
			this.init_tcp()
		}
	}

	getConfigFields() {
		return [
			{
				type: 'text',
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
				default: '0',
			},
		]
	}

	updateActions() {
		this.setActionDefinitions(this.actions())
	}

	updateFeedbacks() {
		//
	}

	updateVariables() {
		this.setVariableDefinitions(this.getVariables())

		this.setVariableValues({
			pt_speed: this.ptSpeedIndex,
			zoom_speed: this.zoomSpeedIndex,
		})
	}

	async destroy() {
		clearInterval(this.request_state)

		if (this.tcp !== undefined) {
			this.tcp.destroy()
		}
		this.debug('destroy', this.id)
	}

	init_presets() {
		const presets = [
			{
				category: 'Pan/Tilt',
				label: 'UP',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.up,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'up',
					},
				],
				release_actions: [
					{
						action: 'stop',
					},
				],
			},
			{
				category: 'Pan/Tilt',
				label: 'DOWN',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.down,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'down',
					},
				],
				release_actions: [
					{
						action: 'stop',
					},
				],
			},
			{
				category: 'Pan/Tilt',
				label: 'LEFT',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.left,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'left',
					},
				],
				release_actions: [
					{
						action: 'stop',
					},
				],
			},
			{
				category: 'Pan/Tilt',
				label: 'RIGHT',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.right,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'right',
					},
				],
				release_actions: [
					{
						action: 'stop',
					},
				],
			},
			{
				category: 'Pan/Tilt',
				label: 'UP RIGHT',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.up_right,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'upRight',
					},
				],
				release_actions: [
					{
						action: 'stop',
					},
				],
			},
			{
				category: 'Pan/Tilt',
				label: 'UP LEFT',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.up_left,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'upLeft',
					},
				],
				release_actions: [
					{
						action: 'stop',
					},
				],
			},
			{
				category: 'Pan/Tilt',
				label: 'DOWN LEFT',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.down_left,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'downLeft',
					},
				],
				release_actions: [
					{
						action: 'stop',
					},
				],
			},
			{
				category: 'Pan/Tilt',
				label: 'DOWN RIGHT',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.down_right,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'downRight',
					},
				],
				release_actions: [
					{
						action: 'stop',
					},
				],
			},
			{
				category: 'Pan/Tilt',
				label: 'Home',
				bank: {
					style: 'text',
					text: 'HOME',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'home',
					},
				],
			},
			{
				category: 'Pan/Tilt',
				label: 'Speed Up',
				bank: {
					style: 'text',
					text: 'SPEED\\nUP',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'ptSpeedU',
					},
				],
			},
			{
				category: 'Pan/Tilt',
				label: 'Speed Down',
				bank: {
					style: 'text',
					text: 'SPEED\\nDOWN',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'ptSpeedD',
					},
				],
			},
			{
				category: 'Lens',
				label: 'Zoom In',
				bank: {
					style: 'text',
					text: 'ZOOM\\nIN',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'zoomI',
					},
				],
				release_actions: [
					{
						action: 'zoomS',
					},
				],
			},
			{
				category: 'Lens',
				label: 'Zoom Out',
				bank: {
					style: 'text',
					text: 'ZOOM\\nOUT',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'zoomO',
					},
				],
				release_actions: [
					{
						action: 'zoomS',
					},
				],
			},
			{
				category: 'Lens',
				label: 'Speed Up',
				bank: {
					style: 'text',
					text: 'Z SPEED\\nUP',
					size: '14',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'zoomSpeedU',
					},
				],
			},
			{
				category: 'Lens',
				label: 'Speed Down',
				bank: {
					style: 'text',
					text: 'Z SPEED\\nDOWN',
					size: '14',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'zoomSpeedD',
					},
				],
			},
			{
				category: 'Lens',
				label: 'Focus Near',
				bank: {
					style: 'text',
					text: 'FOCUS\\nNEAR',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'focusN',
					},
				],
				release_actions: [
					{
						action: 'focusS',
					},
				],
			},
			{
				category: 'Lens',
				label: 'Focus Far',
				bank: {
					style: 'text',
					text: 'FOCUS\\nFAR',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'focusF',
					},
				],
				release_actions: [
					{
						action: 'focusS',
					},
				],
			},
			{
				category: 'Lens',
				label: 'Auto Focus',
				bank: {
					style: 'text',
					text: 'AUTO\\nFOCUS',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
					latch: true,
				},
				actions: [
					{
						action: 'focusM',
						options: {
							bol: 0,
						},
					},
				],
				release_actions: [
					{
						action: 'focusM',
						options: {
							bol: 1,
						},
					},
				],
			},
			{
				category: 'Exposure',
				label: 'Exposure Mode',
				bank: {
					style: 'text',
					text: 'EXP\\nMODE',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
					latch: true,
				},
				actions: [
					{
						action: 'expM',
						options: {
							bol: 0,
						},
					},
				],
				release_actions: [
					{
						action: 'expM',
						options: {
							bol: 1,
						},
					},
				],
			},
			{
				category: 'Exposure',
				label: 'Iris Up',
				bank: {
					style: 'text',
					text: 'IRIS\\nUP',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'irisU',
					},
				],
			},
			{
				category: 'Exposure',
				label: 'Iris Down',
				bank: {
					style: 'text',
					text: 'IRIS\\nDOWN',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'irisD',
					},
				],
			},
			{
				category: 'Exposure',
				label: 'Shutter Up',
				bank: {
					style: 'text',
					text: 'Shut\\nUP',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'shutU',
					},
				],
			},
			{
				category: 'Exposure',
				label: 'Shutter Down',
				bank: {
					style: 'text',
					text: 'Shut\\nDOWN',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'shutD',
					},
				],
			},
			{
				category: 'Tally',
				label: 'GREEN',
				bank: {
					style: 'text',
					text: 'GREEN',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.green,
				},
				actions: [
					{
						action: 'tally',
						options: {
							val: 1,
						},
					},
				],
			},
			{
				category: 'Tally',
				label: 'RED',
				bank: {
					style: 'text',
					text: 'RED',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.red,
				},
				actions: [
					{
						action: 'tally',
						options: {
							val: 0,
						},
					},
				],
			},
			{
				category: 'Tally',
				label: 'OFF',
				bank: {
					style: 'text',
					text: 'OFF',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'tally',
						options: {
							val: 2,
						},
					},
				],
			},
			{
				category: 'OSD',
				label: 'OSD Menu',
				bank: {
					style: 'text',
					text: 'OSD',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
					latch: true,
				},
				actions: [
					{
						action: 'osd',
						options: {
							val: 0,
						},
					},
				],
				release_actions: [
					{
						action: 'osd',
						options: {
							val: 1,
						},
					},
				],
			},
			{
				category: 'OSD',
				label: 'ENTER',
				bank: {
					style: 'text',
					text: 'ENTER',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'osd',
						options: {
							val: 2,
						},
					},
				],
			},
			{
				category: 'OSD',
				label: 'BACK',
				bank: {
					style: 'text',
					text: 'BACK',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'osd',
						options: {
							val: 3,
						},
					},
				],
			},
			{
				category: 'OSD',
				label: 'UP',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.up,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'osd',
						options: {
							val: 4,
						},
					},
				],
				release_actions: [
					{
						action: 'osd',
						options: {
							val: 8,
						},
					},
				],
			},
			{
				category: 'OSD',
				label: 'DOWN',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.down,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'osd',
						options: {
							val: 5,
						},
					},
				],
				release_actions: [
					{
						action: 'osd',
						options: {
							val: 8,
						},
					},
				],
			},
			{
				category: 'OSD',
				label: 'LEFT',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.left,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'osd',
						options: {
							val: 6,
						},
					},
				],
				release_actions: [
					{
						action: 'osd',
						options: {
							val: 8,
						},
					},
				],
			},
			{
				category: 'OSD',
				label: 'RIGHT',
				bank: {
					style: 'png',
					text: '',
					png64: IMAGE.right,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'osd',
						options: {
							val: 7,
						},
					},
				],
				release_actions: [
					{
						action: 'osd',
						options: {
							val: 8,
						},
					},
				],
			},
		]

		let save
		for (save = 0; save < 63; save++) {
			presets.push({
				category: 'Save Preset',
				label: `Save Preset ${parseInt(save + 1)}`,
				bank: {
					style: 'text',
					text: `SAVE\\nPSET\\n${parseInt(save + 1)}`,
					size: '14',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'savePset',
						options: {
							val: `0${save.toString(16).toUpperCase()}`.slice(-2),
						},
					},
				],
			})
		}

		let recall
		for (recall = 0; recall < 63; recall++) {
			presets.push({
				category: 'Recall Preset',
				label: `Recall Preset ${parseInt(recall + 1)}`,
				bank: {
					style: 'text',
					text: `Recall\\nPSET\\n${parseInt(recall + 1)}`,
					size: '14',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				actions: [
					{
						action: 'recallPset',
						options: {
							val: `0${recall.toString(16).toUpperCase()}`.slice(-2),
						},
					},
				],
			})
		}

		this.setPresetDefinitions(presets)
	}

	actions() {
		return {
			left: { label: 'Pan Left' },
			right: { label: 'Pan Right' },
			up: { label: 'Tilt Up' },
			down: { label: 'Tilt Down' },
			upLeft: { label: 'Up Left' },
			upRight: { label: 'Up Right' },
			downLeft: { label: 'Down Left' },
			downRight: { label: 'Down Right' },
			stop: { label: 'P/T Stop' },
			home: { label: 'P/T Home' },
			ptSpeedS: {
				label: 'P/T Speed',
				options: [
					{
						type: 'dropdown',
						label: 'speed setting',
						id: 'speed',
						choices: SPEED,
					},
				],
			},
			ptSpeedU: { label: 'P/T Speed Up' },
			ptSpeedD: { label: 'P/T Speed Down' },
			ptSlow: {
				label: 'P/T Slow Mode',
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
			},
			zoomI: { label: 'Zoom In' },
			zoomO: { label: 'Zoom Out' },
			zoomS: { label: 'Zoom Stop' },
			zoomSpeedS: {
				label: 'Zoom Speed',
				options: [
					{
						type: 'dropdown',
						label: 'speed setting',
						id: 'speed',
						choices: CHOICE_ZOOMSPEED,
					},
				],
			},
			zoomSpeedU: { label: 'Zoom Speed Up' },
			zoomSpeedD: { label: 'Zoom Speed Down' },
			zoomTime: {
				label: 'Zoom Postion In/Out (ms)',
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
			},
			zInMS: {
				label: 'Zoom In for ms',
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
			},
			zOutMS: {
				label: 'Zoom Out for ms',
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
			},
			focusN: { label: 'Focus Near' },
			focusF: { label: 'Focus Far' },
			focusS: { label: 'Focus Stop' },
			focusM: {
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
			},
			expM: {
				label: 'Exposure Mode',
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
			},
			irisU: { label: 'Iris Up' },
			irisD: { label: 'Iris Down' },
			irisS: {
				label: 'Set Iris',
				options: [
					{
						type: 'dropdown',
						label: 'Iris setting',
						id: 'val',
						choices: IRIS,
					},
				],
			},
			shutU: { label: 'Shutter Up' },
			shutD: { label: 'Shutter Down' },
			shutS: {
				label: 'Set Shutter',
				options: [
					{
						type: 'dropdown',
						label: 'Shutter setting',
						id: 'val',
						choices: SHUTTER,
					},
				],
			},
			savePset: {
				label: 'Save Preset',
				options: [
					{
						type: 'dropdown',
						label: 'Preset Nr.',
						id: 'val',
						choices: PRESET,
					},
				],
			},
			recallPset: {
				label: 'Recall Preset',
				options: [
					{
						type: 'dropdown',
						label: 'Preset Nr.',
						id: 'val',
						choices: PRESET,
					},
				],
			},
			custom: {
				label: 'Custom command',
				options: [
					{
						type: 'textinput',
						label: 'Custom command, must start with 8',
						id: 'custom',
						regex: '/^8[0-9a-fA-F]\\s*([0-9a-fA-F]\\s*)+$/',
						width: 6,
					},
				],
			},
			tally: {
				label: 'Tally Colour',
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
			},
			speedPset: {
				label: 'Preset Drive Speed',
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
			},
			osd: {
				label: 'OSD Controls',
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
			},
		}
	}
	requestState() {
		const cmd = '\x09\x7E\x7E\x70\xFF'
		this.sendVISCACommand(cmd)
	}

	// Return config fields for web config

	prependPacketSize = (cmd) => {
		//Calculates the packet size from the provided packet and prepends the bytes
		let cmdsize
		const pktsize = Buffer.alloc(2)

		cmdsize = Buffer.byteLength(cmd) + 2
		pktsize.writeUInt16LE(cmdsize, 0)
		return Buffer.concat([pktsize.swap16(), cmd])
	}

	sendVISCACommand = function (str) {
		if (this.tcp === undefined) {
			return
		}
		let buf = Buffer.from(str, 'binary')
		//Add device ID
		buf = Buffer.concat([this.deviceAddress, buf])

		this.debug(this.prependPacketSize(buf))
		this.tcp.send(this.prependPacketSize(buf))
	}

	action = function (action) {
		const opt = action.options

		const panspeed = String.fromCharCode(parseInt(this.ptSpeed, 16) & 0xff)
		const tiltspeed = String.fromCharCode(Math.min(parseInt(this.ptSpeed, 16), 0x14) & 0xff)

		switch (action.action) {
			case 'left': {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x01\x03\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'right': {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x02\x03\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'up': {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x03\x01\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'down': {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x03\x02\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'upLeft': {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x01\x01\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'upRight': {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x02\x01\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'downLeft': {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x01\x02\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'downRight': {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x02\x02\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'stop': {
				const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x03\x03\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'home': {
				const cmd = '\x01\x06\x04\xFF'
				this.sendVISCACommand(cmd)
				break
			}

			case 'ptSpeedS': {
				this.ptSpeed = opt.speed

				let idx = -1
				for (let i = 0; i < SPEED.length; ++i) {
					if (SPEED[i].id == this.ptSpeed) {
						idx = i
						break
					}
				}
				if (idx > -1) {
					this.ptSpeedIndex = idx
				}
				this.debug(`${this.ptSpeed} == ${this.ptSpeedIndex}`)
				break
			}

			case 'ptSpeedU': {
				if (this.ptSpeedIndex == 23) {
					this.ptSpeedIndex = 23
				} else if (this.ptSpeedIndex < 23) {
					this.ptSpeedIndex++
				}
				this.ptSpeed = SPEED[this.ptSpeedIndex].id
				break
			}

			case 'ptSpeedD': {
				if (this.ptSpeedIndex == 0) {
					this.ptSpeedIndex = 0
				} else if (this.ptSpeedIndex > 0) {
					this.ptSpeedIndex--
				}
				this.ptSpeed = SPEED[this.ptSpeedIndex].id
				break
			}

			case 'zoomSpeedS': {
				this.zoomSpeed = opt.speed

				let idx = -1
				for (let i = 0; i < CHOICE_ZOOMSPEED.length; ++i) {
					if (CHOICE_ZOOMSPEED[i].id == this.zoomSpeed) {
						idx = i
						break
					}
				}
				if (idx > -1) {
					this.zoomSpeedIndex = idx
				}
				this.debug(`${this.zoomSpeed} == ${this.zoomSpeedIndex}`)
				break
			}

			case 'zoomSpeedU': {
				if (this.zoomSpeedIndex == 7) {
					this.zoomSpeedIndex = 7
				} else if (this.zoomSpeedIndex < 7) {
					this.zoomSpeedIndex++
				}
				this.zoomSpeed = CHOICE_ZOOMSPEED[this.zoomSpeedIndex].id
				break
			}

			case 'zoomSpeedD': {
				if (this.zoomSpeedIndex == 1) {
					this.zoomSpeedIndex = 1
				} else if (this.zoomSpeedIndex > 0) {
					this.zoomSpeedIndex--
				}
				this.zoomSpeed = CHOICE_ZOOMSPEED[this.zoomSpeedIndex].id
				break
			}

			case 'zoomI': {
				//Variable zoom speed
				const zoomspeed = String.fromCharCode((parseInt(this.zoomSpeed, 16) + 32) & 0xff)

				const cmd = `\x01\x04\x07${zoomspeed}\xff`
				this.sendVISCACommand(cmd)
				break
			}

			case 'zoomO': {
				//Variable zoom speed
				const zoomspeed = String.fromCharCode((parseInt(this.zoomSpeed, 16) + 48) & 0xff)

				const cmd = `\x01\x04\x07${zoomspeed}\xff`
				this.sendVISCACommand(cmd)
				break
			}

			case 'zoomS': {
				const cmd = '\x01\x04\x07\x00\xFF'
				this.sendVISCACommand(cmd)
				break
			}

			case 'focusN': {
				const cmd = '\x01\x04\x08\x03\xFF'
				this.sendVISCACommand(cmd)
				break
			}

			case 'focusF': {
				const cmd = '\x01\x04\x08\x02\xFF'
				this.sendVISCACommand(cmd)
				break
			}

			case 'focusS': {
				const cmd = '\x01\x04\x08\x00\xFF'
				this.sendVISCACommand(cmd)
				break
			}

			case 'focusM': {
				let cmd
				if (opt.bol == 0) {
					cmd = '\x01\x04\x38\x02\xFF'
				}
				if (opt.bol == 1) {
					cmd = '\x01\x04\x38\x03\xFF'
				}
				this.sendVISCACommand(cmd)
				break
			}

			case 'expM': {
				let cmd
				if (opt.val == 0) {
					cmd = '\x01\x04\x39\x00\xFF'
				}
				if (opt.val == 1) {
					cmd = '\x01\x04\x39\x03\xFF'
				}
				if (opt.val == 2) {
					cmd = '\x01\x04\x39\x0A\xFF'
				}
				if (opt.val == 3) {
					cmd = '\x01\x04\x39\x0B\xFF'
				}
				if (opt.val == 4) {
					cmd = '\x01\x04\x39\x0D\xFF'
				}
				this.sendVISCACommand(cmd)
				break
			}

			case 'irisU': {
				const cmd = '\x01\x04\x0B\x02\xFF'
				this.sendVISCACommand(cmd)
				break
			}

			case 'irisD': {
				const cmd = '\x01\x04\x0B\x03\xFF'
				this.sendVISCACommand(cmd)
				break
			}

			case 'irisS': {
				const cmd = Buffer.from('\x01\x04\x4B\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(opt.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(opt.val, 16) & 0x0f, 7)
				this.sendVISCACommand(cmd)
				this.debug('cmd=', cmd)
				break
			}

			case 'shutU': {
				const cmd = '\x01\x04\x0A\x02\xFF'
				this.sendVISCACommand(cmd)
				break
			}

			case 'shutD': {
				const cmd = '\x01\x04\x0A\x03\xFF'
				this.sendVISCACommand(cmd)
				break
			}

			case 'shutS': {
				const cmd = Buffer.from('\x01\x04\x4A\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(opt.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(opt.val, 16) & 0x0f, 7)
				this.sendVISCACommand(cmd)
				this.debug('cmd=', cmd)
				break
			}

			case 'savePset': {
				const cmd = `\x01\x04\x3F\x01${String.fromCharCode(parseInt(opt.val, 16) & 0xff)}\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'recallPset': {
				const cmd = `\x01\x04\x3F\x02${String.fromCharCode(parseInt(opt.val, 16) & 0xff)}\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'speedPset': {
				const cmd = `\x01\x7E\x01\x0B${String.fromCharCode(parseInt(opt.val, 16) & 0xff)}${String.fromCharCode(parseInt(opt.speed, 16) & 0xff)}\xFF`
				this.sendVISCACommand(cmd)
				break
			}

			case 'tally': {
				let cmd
				if (opt.val == 0) {
					cmd = '\x01\x7E\x01\x0A\x00\x02\x03\xFF'
				}
				if (opt.val == 1) {
					cmd = '\x01\x7E\x01\x0A\x00\x03\x02\xFF'
				}
				if (opt.val == 2) {
					cmd = '\x01\x7E\x01\x0A\x00\x03\x03\xFF'
				}
				this.sendVISCACommand(cmd)
				break
			}

			case 'osd': {
				let cmd
				switch (opt.val) {
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
				this.sendVISCACommand(cmd)
				break
			}

			case 'custom': {
				const hexData = opt.custom.replace(/\s+/g, '')
				const tempBuffer = Buffer.from(hexData, 'hex')
				const cmd = tempBuffer.toString('binary')

				this.sendVISCACommand(cmd)

				break
			}

			case 'zoomTime': {
				//For heads that do not support direct Zoom control

				//Zoom in for ms
				const cmd = '\x01\x04\x07\x27\xff'
				this.sendVISCACommand(cmd)

				setTimeout(() => {
					//Zoom out for ms
					const cmd = '\x01\x04\x07\x37\xff'
					this.sendVISCACommand(cmd)
					setTimeout(() => {
						//Stop
						const cmd = '\x01\x04\x07\x00\xFF'
						this.sendVISCACommand(cmd)
					}, opt.zOut)
				}, opt.zIn)
				break
			}
			case 'zInMS': {
				//Zoom in for ms
				const cmd = '\x01\x04\x07\x27\xff'
				this.sendVISCACommand(cmd)

				setTimeout(() => {
					//Stop
					const cmd = '\x01\x04\x07\x00\xFF'
					this.sendVISCACommand(cmd)
				}, opt.ms)
				break
			}
			case 'zOutMS': {
				//Zoom out for ms
				const cmd = '\x01\x04\x07\x37\xff'
				this.sendVISCACommand(cmd)

				setTimeout(() => {
					//Stop
					const cmd = '\x01\x04\x07\x00\xFF'
					this.sendVISCACommand(cmd)
				}, opt.ms)
				break
			}
		}

		this.setVariable('pt_speed', this.ptSpeedIndex)
		this.setVariable('zoom_speed', this.zoomSpeedIndex)
	}
}
runEntrypoint(ModuleInstance, UpgradeScripts)
