import { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } from '@companion-module/base'
import UpgradeScripts from './upgrades.js'
import { getPresets } from './presets.js'
import { getActions } from './actions.js'
import { ok_pkt, CHOICE_PTSPEED, CHOICE_ZOOMSPEED, findChoiceById } from './constants.js'

class ModuleInstance extends InstanceBase {
	request_state
	config = {}
	ptSpeed = '0C'
	zoomSpeed = '07'

	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.ptSpeed = config.ptSpeed
		this.zoomSpeed = config.zoomSpeed

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
			this.log('debug', 'tcp error:', e.message)
		})

		this.tcp.on('data', (data) => {
			//Ignore the ok response
			if (!data.equals(ok_pkt)) {
				this.log('debug', 'Data from Datavideo VISCA: ', data)
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

		this.log('debug', `${this.tcp.host}:${this.config.port}`)
	}

	async configUpdated(config) {
		this.config = config
		this.ptSpeed = config.ptSpeed
		this.zoomSpeed = config.zoomSpeed

		clearInterval(this.request_state)

		if (this.tcp !== undefined) {
			this.tcp.destroy()
			delete this.tcp
		}

		this.status(this.STATUS_UNKNOWN)

		if (this.config.host !== undefined) {
			this.init_tcp()
		}
		this.updateVariables()
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
				default: '0',
			},
			{
				type: 'dropdown',
				id: 'ptSpeed',
				label: 'Default Pan/Tilt Speed',
				default: '0C',
				choices: CHOICE_PTSPEED,
				width: 6,
			},
			{
				type: 'dropdown',
				id: 'zoomSpeed',
				label: 'Default Zoom Speed',
				default: '07',
				choices: CHOICE_ZOOMSPEED,
				width: 6,
			},
		]
	}

	updateActions() {
		this.setActionDefinitions(getActions(this))
	}

	updateFeedbacks() {
		//
	}

	updateVariables() {
		this.setVariableDefinitions(this.getVariables())

		const ptSpeedChoice = findChoiceById(CHOICE_PTSPEED, this.ptSpeed)
		const zoomSpeedChoice = findChoiceById(CHOICE_ZOOMSPEED, this.zoomSpeed)

		const variables = {
			pt_speed: ptSpeedChoice.id,
			pt_speed_description: ptSpeedChoice.label,
			zoom_speed: zoomSpeedChoice.id,
			zoom_speed_description: zoomSpeedChoice.label,
		}
		this.setVariableValues(variables)
	}

	getVariables() {
		return [
			{
				name: 'Pan/Tilt Speed',
				variableId: 'pt_speed',
			},
			{
				name: 'Pan/Tilt Speed Description',
				variableId: 'pt_speed_description',
			},
			{
				name: 'Zoom Speed',
				variableId: 'zoom_speed',
			},
			{
				name: 'Zoom Speed Description',
				variableId: 'zoom_speed_description',
			},
		]
	}

	async destroy() {
		clearInterval(this.request_state)

		if (this.tcp !== undefined) {
			this.tcp.destroy()
		}
		this.log('debug', 'destroy', this.id)
	}

	initPresets() {
		const presets = getPresets()

		this.setPresetDefinitions(presets)
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

		this.log('debug', this.prependPacketSize(buf))
		this.tcp.send(this.prependPacketSize(buf))
	}
}
runEntrypoint(ModuleInstance, UpgradeScripts)
