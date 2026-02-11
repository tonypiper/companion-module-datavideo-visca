const { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdatePresets = require('./presets')
const UpdateVariableDefinitions = require('./variables')

const ok_pkt = Buffer.from([0x00, 0x08, 0x81, 0x09, 0x7e, 0x7e, 0x70, 0xff])

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

		this.updateStatus(InstanceStatus.Connecting)
		this.initTcp()
		this.updateActions()
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
				if (!data.equals(ok_pkt)) {
					this.log('debug', 'Data from Datavideo VISCA: ' + data.toString('hex'))
				}
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

	sendVISCACommand(str) {
		if (this.tcp !== undefined) {
			let buf = Buffer.from(str, 'binary')
			buf = Buffer.concat([this.deviceAddress, buf])

			this.log('debug', 'Sending: ' + this.prependPacketSize(buf).toString('hex'))
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
		const cmd = '\x09\x7E\x7E\x70\xFF'
		this.sendVISCACommand(cmd)
	}

	getPanTiltSpeeds() {
		const panspeed = String.fromCharCode(parseInt(this.ptSpeed, 16) & 0xff)
		const tiltspeed = String.fromCharCode(Math.min(parseInt(this.ptSpeed, 16), 0x14) & 0xff)
		return { panspeed, tiltspeed }
	}
}

runEntrypoint(DatavideoViscaInstance, UpgradeScripts)
