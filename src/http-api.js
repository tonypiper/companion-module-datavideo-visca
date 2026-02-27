const http = require('http')

class HttpApi {
	constructor(instance) {
		this.instance = instance
		this.host = null
		this.port = 80
		this.pollTimer = null
		this.consecutiveFailures = 0
	}

	init(host, port, intervalMs) {
		this.host = host
		this.port = port || 80
		const interval = intervalMs || 3000
		this.instance.log('info', `HTTP API: starting — host=${this.host} port=${this.port} interval=${interval}ms`)
		this.pollSysInfo()
		this.startPolling(interval)
	}

	destroy() {
		this.stopPolling()
		this.host = null
		this.consecutiveFailures = 0
	}

	startPolling(intervalMs) {
		this.stopPolling()
		this.pollTimer = setInterval(() => {
			this.pollVideoParam()
		}, intervalMs)
	}

	stopPolling() {
		clearInterval(this.pollTimer)
		this.pollTimer = null
	}

	_postAjaxcom(cmdObj) {
		return new Promise((resolve) => {
			const body = 'szCmd=' + encodeURIComponent(JSON.stringify(cmdObj))
			const options = {
				hostname: this.host,
				port: this.port,
				path: '/ajaxcom',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': Buffer.byteLength(body),
				},
				timeout: 5000,
			}

			const req = http.request(options, (res) => {
				let data = ''
				res.on('data', (chunk) => {
					data += chunk
				})
				res.on('end', () => {
					try {
						resolve(JSON.parse(data))
					} catch (e) {
						this.instance.log('debug', `HTTP API: failed to parse response: ${e.message}`)
						resolve(null)
					}
				})
			})

			req.on('timeout', () => {
				req.destroy()
				if (this.consecutiveFailures === 0) {
					this.instance.log('warn', 'HTTP API: request timed out')
				} else {
					this.instance.log('debug', 'HTTP API: request timed out')
				}
				resolve(null)
			})

			req.on('error', (e) => {
				if (this.consecutiveFailures === 0) {
					this.instance.log('warn', `HTTP API: request error: ${e.message}`)
				} else {
					this.instance.log('debug', `HTTP API: request error: ${e.message}`)
				}
				resolve(null)
			})

			req.write(body)
			req.end()
		})
	}

	async pollSysInfo() {
		const sysAttr = await this._postAjaxcom({ GetEnv: { SysAttr: { nChannel: -1 } } })
		const version = await this._postAjaxcom({ QueryState: { QueryVersion: {} } })

		const values = {}
		// Real hardware wraps the response in stValue
		const sysData = sysAttr?.stValue || sysAttr?.SysAttr
		if (sysData) {
			values.http_model_name = sysData.szModelName || ''
		}
		const verData = version?.stValue || version?.QueryVersion
		if (verData) {
			values.http_firmware_version = verData.szFirmwareVersion || ''
		}

		if (Object.keys(values).length > 0) {
			this.instance.log('debug', `HTTP API sysinfo: ${JSON.stringify(values)}`)
			this.instance.setVariableValues(values)
		}
	}

	async pollVideoParam() {
		const data = await this._postAjaxcom({ GetEnv: { VideoParam: { nChannel: 0 } } })

		if (!data) {
			this.consecutiveFailures++
			if (this.consecutiveFailures === 1) {
				this.instance.log('warn', 'HTTP API: poll failed')
			} else {
				this.instance.log('debug', `HTTP API: poll failed (${this.consecutiveFailures} consecutive)`)
			}
			if (this.consecutiveFailures >= 10) {
				this.instance.log('warn', 'HTTP API: 10 consecutive failures, stopping polling')
				this.stopPolling()
			}
			return
		}

		if (this.consecutiveFailures > 0) {
			this.instance.log('info', 'HTTP API: connection recovered')
			this.consecutiveFailures = 0
		}

		const values = this._parseVideoParam(data)
		if (values) {
			this.instance.log('debug', `HTTP API poll: ${JSON.stringify(values)}`)
			this.instance.setVariableValues(values)
		}
	}

	_parseVideoParam(data) {
		// Real hardware: { stValue: [{ nChannel: 0, stImg: {...}, ... }], nRetVal: 0 }
		// Mock server:   { VideoParam: { stColor: {...}, stImg: {...}, ... } }
		let vp = data.VideoParam
		if (!vp && Array.isArray(data.stValue) && data.stValue.length > 0) {
			vp = data.stValue[0]
		}
		if (!vp) return null

		const values = {}
		const color = vp.stColor
		if (color) {
			if (color.hue !== undefined) values.http_hue = color.hue - 15
			if (color.saturation !== undefined) values.http_saturation = color.saturation
		}

		const img = vp.stImg
		if (img) {
			if (img.luminance !== undefined) values.http_luminance = img.luminance
			if (img.contrast !== undefined) values.http_contrast = img.contrast
			if (img.sharpness !== undefined) values.http_sharpness = img.sharpness
			if (img.gamma !== undefined) values.http_gamma = img.gamma
		}

		const nr = vp.stNR
		if (nr) {
			if (nr.noise2D !== undefined) values.http_noise_2d = nr.noise2D
			if (nr.noise3D !== undefined) values.http_noise_3d = nr.noise3D
		}

		const exp = vp.stExp
		if (exp) {
			if (exp.gainLimit !== undefined) {
				values.http_gain_limit = exp.gainLimit
				// gainLimit maps to dB in 3dB steps (4=9dB, 6=15dB, 15=42dB)
				const db = exp.gainLimit * 3 - 3
				values.http_gain_limit_label = db + 'dB'
			}
			// Real hardware uses lowercase field names
			const expComp = exp.expComp !== undefined ? exp.expComp : exp.expcomp
			if (expComp !== undefined) values.http_exp_comp = expComp
			const expCompEn = exp.expCompEn !== undefined ? exp.expCompEn : exp.expcomp_mode
			if (expCompEn !== undefined) values.http_exp_comp_enabled = expCompEn ? 'On' : 'Off'
			const flicker = exp.antiFlicker !== undefined ? exp.antiFlicker : exp.antiflicker
			if (flicker !== undefined) {
				const flickerLabels = { 0: 'Off', 1: '50Hz', 2: '60Hz' }
				values.http_anti_flicker = flickerLabels[flicker] || String(flicker)
			}
			const slowShutter = exp.slowShutter !== undefined ? exp.slowShutter : exp.slowLight
			if (slowShutter === undefined && img && img.slowLight !== undefined) {
				values.http_slow_shutter = img.slowLight ? 'On' : 'Off'
			} else if (slowShutter !== undefined) {
				values.http_slow_shutter = slowShutter ? 'On' : 'Off'
			}
		}

		return values
	}
}

module.exports = HttpApi
