/**
 * Mock HTTP API server for testing the Datavideo PTC-145T HTTP polling.
 *
 * Simulates the /ajaxcom endpoint that returns VideoParam, SysAttr, and
 * QueryVersion responses. Values drift slowly to simulate a live camera.
 *
 * Usage:
 *   node tools/http-mock.js [port]
 *
 * Default port is 80. Point Companion's HTTP API port at 127.0.0.1:<port>.
 */

const http = require('http')

const PORT = parseInt(process.argv[2], 10) || 80

// Mutable state — values drift over time to make polling visible
const state = {
	stColor: { hue: 15, saturation: 7, luminance: 7 },
	stImg: { contrast: 7, sharpness: 8, gamma: 2 },
	stNR: { noise2D: 3, noise3D: 3 },
	stExp: { gainLimit: 8, expComp: 7, expCompEn: 0, antiFlicker: 0, slowShutter: 0 },
}

// Drift a value within [min, max] by ±1 randomly
function drift(val, min, max) {
	const delta = Math.random() < 0.5 ? -1 : 1
	return Math.max(min, Math.min(max, val + delta))
}

// Occasionally drift values to simulate camera changes
function driftState() {
	if (Math.random() < 0.3) state.stColor.hue = drift(state.stColor.hue, 0, 30)
	if (Math.random() < 0.2) state.stColor.saturation = drift(state.stColor.saturation, 0, 14)
	if (Math.random() < 0.2) state.stColor.luminance = drift(state.stColor.luminance, 0, 14)
	if (Math.random() < 0.2) state.stImg.contrast = drift(state.stImg.contrast, 0, 14)
	if (Math.random() < 0.2) state.stImg.sharpness = drift(state.stImg.sharpness, 0, 15)
	if (Math.random() < 0.1) state.stImg.gamma = drift(state.stImg.gamma, 0, 4)
	if (Math.random() < 0.1) state.stNR.noise2D = drift(state.stNR.noise2D, 0, 5)
	if (Math.random() < 0.1) state.stNR.noise3D = drift(state.stNR.noise3D, 0, 5)
	if (Math.random() < 0.1) state.stExp.gainLimit = drift(state.stExp.gainLimit, 1, 15)
}

function handleAjaxcom(cmdObj) {
	if (cmdObj.GetEnv) {
		if (cmdObj.GetEnv.VideoParam !== undefined) {
			driftState()
			return { VideoParam: { ...state } }
		}
		if (cmdObj.GetEnv.SysAttr) {
			return { SysAttr: { szModelName: 'PTC-145T', nChannel: 0 } }
		}
	}
	if (cmdObj.QueryState) {
		if (cmdObj.QueryState.QueryVersion !== undefined) {
			return { QueryVersion: { szFirmwareVersion: '3.10.1' } }
		}
	}
	return { error: 'unknown command' }
}

function timestamp() {
	return new Date().toISOString().substr(11, 12)
}

const server = http.createServer((req, res) => {
	if (req.method !== 'POST' || req.url !== '/ajaxcom') {
		console.log(`[${timestamp()}] ${req.method} ${req.url} → 404`)
		res.writeHead(404)
		res.end('Not Found')
		return
	}

	let body = ''
	req.on('data', (chunk) => {
		body += chunk
	})
	req.on('end', () => {
		try {
			const params = new URLSearchParams(body)
			const szCmd = params.get('szCmd')
			const cmdObj = JSON.parse(szCmd)
			const cmdKey = Object.keys(cmdObj)[0]
			const subKey = cmdObj[cmdKey] ? Object.keys(cmdObj[cmdKey])[0] : '?'

			const response = handleAjaxcom(cmdObj)

			console.log(`[${timestamp()}] ${cmdKey}.${subKey} → ${JSON.stringify(response).substring(0, 120)}`)

			res.writeHead(200, { 'Content-Type': 'application/json' })
			res.end(JSON.stringify(response))
		} catch (e) {
			console.log(`[${timestamp()}] Parse error: ${e.message}`)
			res.writeHead(400)
			res.end('Bad Request')
		}
	})
})

server.on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		console.error(`Port ${PORT} is already in use. Try: node tools/http-mock.js <port>`)
	} else if (err.code === 'EACCES') {
		console.error(`Port ${PORT} requires elevated privileges. Try a higher port: node tools/http-mock.js 8080`)
	} else {
		console.error(`Server error: ${err.message}`)
	}
	throw new Error('Server startup failed')
})

server.listen(PORT, () => {
	console.log(`HTTP Mock Server listening on port ${PORT}`)
	console.log(`Set Companion HTTP API port to ${PORT}`)
	console.log('Press Ctrl+C to stop\n')
	console.log('Initial state:')
	console.log(`  Hue: ${state.stColor.hue} (displayed as ${state.stColor.hue - 15})`)
	console.log(`  Saturation: ${state.stColor.saturation}, Luminance: ${state.stColor.luminance}`)
	console.log(`  Contrast: ${state.stImg.contrast}, Sharpness: ${state.stImg.sharpness}, Gamma: ${state.stImg.gamma}`)
	console.log(`  NR 2D: ${state.stNR.noise2D}, NR 3D: ${state.stNR.noise3D}`)
	console.log(`  Gain Limit: ${state.stExp.gainLimit}, Exp Comp: ${state.stExp.expComp}`)
	console.log()
})
