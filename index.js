import { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } from '@companion-module/base'
import UpgradeScripts from './upgrades.js'
import { IRIS, SHUTTER, SPEED, CHOICE_ZOOMSPEED, COLOR, IMAGE, ActionId } from './constants.js'

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
		this.initPresets()
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

	initPresets() {
		const presets = {
			up: {
				type: 'button',
				category: 'Pan/Tilt',
				name: 'UP',
				style: {
					text: '',
					png64: IMAGE.up,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.up }],
						up: [{ actionId: ActionId.stop }],
					},
				],
			},
			down: {
				type: 'button',
				category: 'Pan/Tilt',
				name: 'DOWN',
				style: {
					text: '',
					png64: IMAGE.down,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.down }],
						up: [{ actionId: ActionId.stop }],
					},
				],
			},
			left: {
				type: 'button',
				category: 'Pan/Tilt',
				name: 'LEFT',
				style: {
					text: '',
					png64: IMAGE.left,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.left }],
						up: [{ actionId: ActionId.stop }],
					},
				],
			},
			right: {
				type: 'button',
				category: 'Pan/Tilt',
				name: 'RIGHT',
				style: {
					text: '',
					png64: IMAGE.right,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.right }],
						up: [{ actionId: ActionId.stop }],
					},
				],
			},
			upRight: {
				type: 'button',
				category: 'Pan/Tilt',
				name: 'UP RIGHT',
				style: {
					text: '',
					png64: IMAGE.up_right,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.upRight }],
						up: [{ actionId: ActionId.stop }],
					},
				],
			},
			upLeft: {
				type: 'button',
				category: 'Pan/Tilt',
				name: 'UP LEFT',
				style: {
					text: '',
					png64: IMAGE.up_left,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.upLeft }],
						up: [{ actionId: ActionId.stop }],
					},
				],
			},
			downLeft: {
				type: 'button',
				category: 'Pan/Tilt',
				name: 'DOWN LEFT',
				style: {
					text: '',
					png64: IMAGE.down_left,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.downLeft }],
						up: [{ actionId: ActionId.stop }],
					},
				],
			},
			downRight: {
				type: 'button',
				category: 'Pan/Tilt',
				name: 'DOWN RIGHT',
				style: {
					text: '',
					png64: IMAGE.down_right,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.downRight }],
						up: [{ actionId: ActionId.stop }],
					},
				],
			},
			home: {
				type: 'button',
				category: 'Pan/Tilt',
				name: 'Home',
				style: {
					text: 'HOME',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.home }],
						up: [],
					},
				],
			},
			speedUp: {
				type: 'button',
				category: 'Pan/Tilt',
				name: 'Speed Up',
				style: {
					text: 'SPEED\\nUP',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.ptSpeedU }],
						up: [],
					},
				],
			},
			speedDown: {
				type: 'button',
				category: 'Pan/Tilt',
				name: 'Speed Down',
				style: {
					text: 'SPEED\\nDOWN',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.ptSpeedD }],
						up: [],
					},
				],
			},
			zoomIn: {
				type: 'button',
				category: 'Lens',
				name: 'Zoom In',
				style: {
					text: 'ZOOM\\nIN',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.zoomI }],
						up: [{ actionId: ActionId.zoomS }],
					},
				],
			},
			zoomOut: {
				type: 'button',
				category: 'Lens',
				name: 'Zoom Out',
				style: {
					text: 'ZOOM\\nOUT',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.zoomO }],
						up: [{ actionId: ActionId.stop }],
					},
				],
			},
			zoomSpeedUp: {
				type: 'button',
				category: 'Lens',
				name: 'Speed Up',
				style: {
					text: 'Z SPEED\\nUP',
					size: '14',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.zoomSpeedU }],
						up: [],
					},
				],
			},
			zoomSpeedDown: {
				type: 'button',
				category: 'Lens',
				name: 'Speed Down',
				style: {
					text: 'Z SPEED\\nDOWN',
					size: '14',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.zoomSpeedD }],
						up: [],
					},
				],
			},
			focusNear: {
				type: 'button',
				category: 'Lens',
				name: 'Focus Near',
				style: {
					text: 'FOCUS\\nNEAR',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.focusN }],
						up: [{ actionId: ActionId.focusS }],
					},
				],
			},
			focusFar: {
				type: 'button',
				category: 'Lens',
				name: 'Focus Far',
				style: {
					text: 'FOCUS\\nFAR',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.focusF }],
						up: [{ actionId: ActionId.focusS }],
					},
				],
			},
			focusAuto: {
				type: 'button',
				category: 'Lens',
				name: 'Auto Focus',
				style: {
					text: 'AUTO\\nFOCUS',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.focusM, options: { bol: 0 } }],
						up: [],
					},
					{
						down: [{ actionId: ActionId.focusM, options: { bol: 1 } }],
						up: [],
					},
				],
			},
			exposureMode: {
				type: 'button',
				category: 'Exposure',
				name: 'Exposure Mode',
				style: {
					text: 'EXP\\nMODE',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.expM, options: { bol: 0 } }],
						up: [],
					},
					{
						down: [{ actionId: ActionId.expM, options: { bol: 1 } }],
						up: [],
					},
				],
			},
			irisUp: {
				type: 'button',
				category: 'Exposure',
				name: 'Iris Up',
				style: {
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
			irisDown: {
				type: 'button',
				category: 'Exposure',
				name: 'Iris Down',
				style: {
					text: 'IRIS\\nDOWN',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.irisD }],
						up: [],
					},
				],
			},
			shutterUp: {
				type: 'button',
				category: 'Exposure',
				name: 'Shutter Up',
				style: {
					text: 'Shut\\nUP',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.shutU }],
						up: [],
					},
				],
			},
			shutterDown: {
				type: 'button',
				category: 'Exposure',
				name: 'Shutter Down',
				style: {
					text: 'Shut\\nDOWN',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.shutD }],
						up: [],
					},
				],
			},
			tallyGreen: {
				type: 'button',
				category: 'Tally',
				name: 'GREEN',
				style: {
					text: 'GREEN',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.green,
				},
				steps: [
					{
						down: [{ actionId: ActionId.tally, options: { val: 1 } }],
						up: [],
					},
				],
			},
			tallyRed: {
				type: 'button',
				category: 'Tally',
				name: 'RED',
				style: {
					text: 'RED',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.red,
				},
				steps: [
					{
						down: [{ actionId: ActionId.tally, options: { val: 0 } }],
						up: [],
					},
				],
			},
			tallyOff: {
				type: 'button',
				category: 'Tally',
				name: 'OFF',
				style: {
					text: 'OFF',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.tally, options: { val: 2 } }],
						up: [],
					},
				],
			},
			osdMenu: {
				type: 'button',
				category: 'OSD',
				name: 'OSD Menu',
				style: {
					text: 'OSD',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.osd, options: { val: 0 } }],
						up: [],
					},
					{
						down: [{ actionId: ActionId.osd, options: { val: 1 } }],
						up: [],
					},
				],
			},
			osdEnter: {
				type: 'button',

				category: 'OSD',
				name: 'ENTER',
				style: {
					text: 'ENTER',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.osd, options: { val: 2 } }],
						up: [],
					},
				],
			},
			osdBack: {
				type: 'button',

				category: 'OSD',
				name: 'BACK',
				style: {
					text: 'BACK',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.osd, options: { val: 3 } }],
						up: [],
					},
				],
			},
			osdUp: {
				type: 'button',

				category: 'OSD',
				name: 'UP',
				style: {
					text: '',
					png64: IMAGE.up,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.osd, options: { val: 4 } }],
						up: [{ actionId: ActionId.osd, options: { val: 8 } }],
					},
				],
			},
			osdDown: {
				type: 'button',

				category: 'OSD',
				name: 'DOWN',
				style: {
					text: '',
					png64: IMAGE.down,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.osd, options: { val: 5 } }],
						up: [{ actionId: ActionId.osd, options: { val: 8 } }],
					},
				],
			},
			oseLeft: {
				type: 'button',

				category: 'OSD',
				name: 'LEFT',
				style: {
					text: '',
					png64: IMAGE.left,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.osd, options: { val: 6 } }],
						up: [{ actionId: ActionId.osd, options: { val: 8 } }],
					},
				],
			},
			osdRight: {
				type: 'button',

				category: 'OSD',
				name: 'RIGHT',
				style: {
					text: '',
					png64: IMAGE.right,
					pngalignment: 'center:center',
					size: '18',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [{ actionId: ActionId.osd, options: { val: 7 } }],
						up: [{ actionId: ActionId.osd, options: { val: 8 } }],
					},
				],
			},
		}

		let save
		for (save = 0; save < 63; save++) {
			presets[`save${save + 1}`] = {
				type: 'button',
				category: 'Save Preset',
				name: `Save Preset ${parseInt(save + 1)}`,
				style: {
					text: `SAVE\\nPSET\\n${parseInt(save + 1)}`,
					size: '14',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [
							{
								actionId: 'savePset',
								options: {
									val: `0${save.toString(16).toUpperCase()}`.slice(-2),
								},
							},
						],
						up: [],
					},
				],
			}
		}

		let recall
		for (recall = 0; recall < 63; recall++) {
			presets[`recall${recall + 1}`] = {
				type: 'button',
				category: 'Recall Preset',
				name: `Recall Preset ${parseInt(recall + 1)}`,
				style: {
					text: `Recall\\nPSET\\n${parseInt(recall + 1)}`,
					size: '14',
					color: COLOR.white,
					bgcolor: COLOR.black,
				},
				steps: [
					{
						down: [
							{
								actionId: 'recallPset',
								options: {
									val: `0${recall.toString(16).toUpperCase()}`.slice(-2),
								},
							},
						],
						up: [],
					},
				],
			}
		}

		console.log(presets)

		this.setPresetDefinitions(presets)
	}

	actions() {
		const panspeed = String.fromCharCode(parseInt(this.ptSpeed, 16) & 0xff)
		const tiltspeed = String.fromCharCode(Math.min(parseInt(this.ptSpeed, 16), 0x14) & 0xff)

		return {
			[ActionId.left]: {
				name: 'Pan Left',
				callback: async (_action) => {
					const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x01\x03\xFF`
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.right]: {
				name: 'Pan Right',
				callback: async (_action) => {
					const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x02\x03\xFF`
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.up]: {
				name: 'Tilt Up',
				callback: async (_action) => {
					const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x03\x01\xFF`
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.down]: {
				name: 'Tilt Down',
				callback: async (_action) => {
					const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x03\x02\xFF`
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.upLeft]: {
				name: 'Up Left',
				callback: async (_action) => {
					const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x01\x01\xFF`
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.upRight]: {
				name: 'Up Right',
				callback: async (_action) => {
					const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x02\x01\xFF`
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.downLeft]: {
				name: 'Down Left',
				callback: async (_action) => {
					const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x01\x02\xFF`
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.downRight]: {
				name: 'Down Right',
				callback: async (_action) => {
					const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x02\x02\xFF`
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.stop]: {
				name: 'P/T Stop',
				callback: async (_action) => {
					const cmd = `\x01\x06\x01${panspeed}${tiltspeed}\x03\x03\xFF`
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.home]: {
				name: 'P/T Home',
				callback: async (_action) => {
					const cmd = '\x01\x06\x04\xFF'
					this.sendVISCACommand(cmd)
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
					this.ptSpeed = action.options.speed

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
				},
			},
			[ActionId.ptSpeedU]: {
				name: 'P/T Speed Up',
				callback: async (_action) => {
					if (this.ptSpeedIndex == 23) {
						this.ptSpeedIndex = 23
					} else if (this.ptSpeedIndex < 23) {
						this.ptSpeedIndex++
					}
					this.ptSpeed = SPEED[this.ptSpeedIndex].id
				},
				options: [],
			},
			[ActionId.ptSpeedD]: {
				name: 'P/T Speed Down',
				callback: async (_action) => {
					if (this.ptSpeedIndex == 0) {
						this.ptSpeedIndex = 0
					} else if (this.ptSpeedIndex > 0) {
						this.ptSpeedIndex--
					}
					this.ptSpeed = SPEED[this.ptSpeedIndex].id
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
					const zoomspeed = String.fromCharCode((parseInt(this.zoomSpeed, 16) + 32) & 0xff)

					const cmd = `\x01\x04\x07${zoomspeed}\xff`
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.zoomO]: {
				name: 'Zoom Out',
				callback: async (_action) => {
					//Variable zoom speed
					const zoomspeed = String.fromCharCode((parseInt(this.zoomSpeed, 16) + 48) & 0xff)

					const cmd = `\x01\x04\x07${zoomspeed}\xff`
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.zoomS]: {
				name: 'Zoom Stop',
				callback: async (_action) => {
					const cmd = '\x01\x04\x07\x00\xFF'
					this.sendVISCACommand(cmd)
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
					this.zoomSpeed = action.options.speed

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
				},
			},
			[ActionId.zoomSpeedU]: {
				name: 'Zoom Speed Up',
				callback: async (_action) => {
					if (this.zoomSpeedIndex == 7) {
						this.zoomSpeedIndex = 7
					} else if (this.zoomSpeedIndex < 7) {
						this.zoomSpeedIndex++
					}
					this.zoomSpeed = CHOICE_ZOOMSPEED[this.zoomSpeedIndex].id
				},
				options: [],
			},
			[ActionId.zoomSpeedD]: {
				name: 'Zoom Speed Down',
				callback: async (_action) => {
					if (this.zoomSpeedIndex == 1) {
						this.zoomSpeedIndex = 1
					} else if (this.zoomSpeedIndex > 0) {
						this.zoomSpeedIndex--
					}
					this.zoomSpeed = CHOICE_ZOOMSPEED[this.zoomSpeedIndex].id
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
					this.sendVISCACommand(cmd)

					setTimeout(() => {
						//Zoom out for ms
						const cmd = '\x01\x04\x07\x37\xff'
						this.sendVISCACommand(cmd)
						setTimeout(() => {
							//Stop
							const cmd = '\x01\x04\x07\x00\xFF'
							this.sendVISCACommand(cmd)
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
					this.sendVISCACommand(cmd)

					setTimeout(() => {
						//Stop
						const cmd = '\x01\x04\x07\x00\xFF'
						this.sendVISCACommand(cmd)
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
					this.sendVISCACommand(cmd)

					setTimeout(() => {
						//Stop
						const cmd = '\x01\x04\x07\x00\xFF'
						this.sendVISCACommand(cmd)
					}, action.options.ms)
				},
			},
			[ActionId.focusN]: {
				name: 'Focus Near',
				callback: async (_action) => {
					const cmd = '\x01\x04\x08\x03\xFF'
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.focusF]: {
				name: 'Focus Far',
				callback: async (_action) => {
					const cmd = '\x01\x04\x08\x02\xFF'
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.focusS]: {
				name: 'Focus Stop',
				callback: async (_action) => {
					const cmd = '\x01\x04\x08\x00\xFF'
					this.sendVISCACommand(cmd)
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
					this.sendVISCACommand(cmd)
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
					this.sendVISCACommand(cmd)
				},
			},
			[ActionId.irisU]: {
				name: 'Iris Up',
				callback: async (_action) => {
					const cmd = '\x01\x04\x0B\x02\xFF'
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.irisD]: {
				name: 'Iris Down',
				callback: async (_action) => {
					const cmd = '\x01\x04\x0B\x03\xFF'
					this.sendVISCACommand(cmd)
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
					this.sendVISCACommand(cmd)
					this.debug('cmd=', cmd)
				},
			},
			[ActionId.shutU]: {
				name: 'Shutter Up',
				callback: async (_action) => {
					const cmd = '\x01\x04\x0A\x02\xFF'
					this.sendVISCACommand(cmd)
				},
				options: [],
			},
			[ActionId.shutD]: {
				name: 'Shutter Down',
				callback: async (_action) => {
					const cmd = '\x01\x04\x0A\x03\xFF'
					this.sendVISCACommand(cmd)
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
					this.sendVISCACommand(cmd)
					this.debug('cmd=', cmd)
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
					this.sendVISCACommand(cmd)
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
					this.sendVISCACommand(cmd)
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

					this.sendVISCACommand(cmd)
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
					this.sendVISCACommand(cmd)
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
					this.sendVISCACommand(cmd)
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
					this.sendVISCACommand(cmd)
				},
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

	action = function (_action) {
		this.setVariable('pt_speed', this.ptSpeedIndex)
		this.setVariable('zoom_speed', this.zoomSpeedIndex)
	}
}
runEntrypoint(ModuleInstance, UpgradeScripts)
