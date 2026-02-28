import type { InstanceBase } from '@companion-module/base'
import { createRequire } from 'module'
import {
	IRIS,
	IRIS_LABELS,
	IRIS_POSITIONS,
	SHUTTER,
	SHUTTER_LABELS,
	SHUTTER_POSITIONS,
	GAIN_LABELS,
	GAIN_POSITIONS,
	FOCUS_MODE,
	FOCUS_MODE_AUTO,
	FOCUS_MODE_MANUAL,
	EXPOSURE_MODE,
	AE_MODE_AUTO,
	AE_MODE_MANUAL,
	AE_MODE_SHUTTER,
	AE_MODE_IRIS,
	AE_MODE_BRIGHT,
	WB_MODE,
	WB_MODE_AUTO,
	WB_MODE_INDOOR,
	WB_MODE_OUTDOOR,
	WB_MODE_MANUAL,
	WB_MODE_ONEPUSH,
	WB_MODE_VAR,
	SPEED,
	CHOICE_ZOOMSPEED,
} from './constants.js'

// PRESET is built dynamically in constants.js (for-loop with push), so TypeScript
// infers it as any[]. Use createRequire to load it with an explicit type assertion.
const esmRequire = createRequire(import.meta.url)
const { PRESET: PRESETS } = esmRequire('./constants.js') as {
	PRESET: Array<{ id: string; label: string }>
}

type Self = InstanceBase<Record<string, never>> & Record<string, any>

function irisLabel(pos: number): string {
	const label = IRIS_LABELS[pos]
	return label ? label + ' (' + pos + ')' : 'Pos ' + pos
}

function shutterLabel(pos: number): string {
	const label = SHUTTER_LABELS[pos]
	return label ? label + ' (' + pos + ')' : 'Pos ' + pos
}

function gainLabel(pos: number): string {
	const label = GAIN_LABELS[pos]
	return label ? label + ' (' + pos + ')' : 'Pos ' + pos
}

export function initActions(self: Self): void {
	const actions: Record<string, any> = {
		left: {
			name: 'Pan Left',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x01\x03\xFF'
				self.sendVISCACommand(cmd)
				self.startContinuousPolling('pan_tilt_position')
			},
		},
		right: {
			name: 'Pan Right',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x02\x03\xFF'
				self.sendVISCACommand(cmd)
				self.startContinuousPolling('pan_tilt_position')
			},
		},
		up: {
			name: 'Tilt Up',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x03\x01\xFF'
				self.sendVISCACommand(cmd)
				self.startContinuousPolling('pan_tilt_position')
			},
		},
		down: {
			name: 'Tilt Down',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x03\x02\xFF'
				self.sendVISCACommand(cmd)
				self.startContinuousPolling('pan_tilt_position')
			},
		},
		upLeft: {
			name: 'Up Left',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x01\x01\xFF'
				self.sendVISCACommand(cmd)
				self.startContinuousPolling('pan_tilt_position')
			},
		},
		upRight: {
			name: 'Up Right',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x02\x01\xFF'
				self.sendVISCACommand(cmd)
				self.startContinuousPolling('pan_tilt_position')
			},
		},
		downLeft: {
			name: 'Down Left',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x01\x02\xFF'
				self.sendVISCACommand(cmd)
				self.startContinuousPolling('pan_tilt_position')
			},
		},
		downRight: {
			name: 'Down Right',
			options: [],
			callback: () => {
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x02\x02\xFF'
				self.sendVISCACommand(cmd)
				self.startContinuousPolling('pan_tilt_position')
			},
		},
		stop: {
			name: 'P/T Stop',
			options: [],
			callback: () => {
				self.stopContinuousPolling()
				const { panspeed, tiltspeed } = self.getPanTiltSpeeds()
				const cmd = '\x01\x06\x01' + panspeed + tiltspeed + '\x03\x03\xFF'
				self.sendVISCACommand(cmd)
				self.pollAfterCommand('pan_tilt_position', 0)
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
			callback: (action: any) => {
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
			callback: (_action: any) => {
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
				self.startContinuousPolling('zoom_position')
			},
		},
		zoomO: {
			name: 'Zoom Out',
			options: [],
			callback: () => {
				const zoomspeed = String.fromCharCode((parseInt(self.zoomSpeed, 16) + 48) & 0xff)
				const cmd = '\x01\x04\x07' + zoomspeed + '\xff'
				self.sendVISCACommand(cmd)
				self.startContinuousPolling('zoom_position')
			},
		},
		zoomS: {
			name: 'Zoom Stop',
			options: [],
			callback: () => {
				self.stopContinuousPolling()
				const cmd = '\x01\x04\x07\x00\xFF'
				self.sendVISCACommand(cmd)
				self.pollAfterCommand('zoom_position', 0)
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
			callback: (action: any) => {
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
			callback: (action: any) => {
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
			callback: (action: any) => {
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
			callback: (action: any) => {
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
				if (self.getVariableValue('focus_mode') !== FOCUS_MODE_MANUAL) {
					self.log('debug', 'Focus Near ignored \u2014 focus mode is not Manual')
					return
				}
				const cmd = '\x01\x04\x08\x03\xFF'
				self.sendVISCACommand(cmd)
				self.startContinuousPolling('focus_position')
			},
		},
		focusF: {
			name: 'Focus Far',
			options: [],
			callback: () => {
				if (self.getVariableValue('focus_mode') !== FOCUS_MODE_MANUAL) {
					self.log('debug', 'Focus Far ignored \u2014 focus mode is not Manual')
					return
				}
				const cmd = '\x01\x04\x08\x02\xFF'
				self.sendVISCACommand(cmd)
				self.startContinuousPolling('focus_position')
			},
		},
		focusS: {
			name: 'Focus Stop',
			options: [],
			callback: () => {
				self.stopContinuousPolling()
				const cmd = '\x01\x04\x08\x00\xFF'
				self.sendVISCACommand(cmd)
				self.pollAfterCommand('focus_position', 0)
			},
		},
		focusOnePush: {
			name: 'Focus One Push Trigger',
			options: [],
			callback: () => {
				if (self.getVariableValue('focus_mode') !== FOCUS_MODE_MANUAL) {
					self.log('debug', 'Focus One Push ignored \u2014 focus mode is not Manual')
					return
				}
				self.sendVISCACommand('\x01\x04\x18\x01\xFF')
			},
		},
		focusM: {
			name: 'Focus Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Auto / Manual Focus',
					id: 'bol',
					choices: FOCUS_MODE,
					default: '0',
				},
			],
			callback: (action: any) => {
				const match = FOCUS_MODE.find((m) => m.id === action.options.bol)
				self.setVariableValues({ focus_mode: match ? match.label : action.options.bol.toString() })
				self.checkFeedbacks('focus_mode_manual')
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
		focusMCycle: {
			name: 'Focus Mode Cycle',
			options: [],
			callback: () => {
				const current = self.getVariableValue('focus_mode')
				if (current === FOCUS_MODE_MANUAL) {
					self.setVariableValues({ focus_mode: FOCUS_MODE_AUTO })
					self.checkFeedbacks('focus_mode_manual')
					self.sendVISCACommand('\x01\x04\x38\x02\xFF')
				} else {
					self.setVariableValues({ focus_mode: FOCUS_MODE_MANUAL })
					self.checkFeedbacks('focus_mode_manual')
					self.sendVISCACommand('\x01\x04\x38\x03\xFF')
				}
			},
		},
		expM: {
			name: 'Exposure Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode setting',
					id: 'val',
					choices: EXPOSURE_MODE,
					default: '0',
				},
			],
			callback: (action: any) => {
				const AE_OPTION_LABELS: Record<number, string> = {
					0: AE_MODE_AUTO,
					1: AE_MODE_MANUAL,
					2: AE_MODE_SHUTTER,
					3: AE_MODE_IRIS,
					4: AE_MODE_BRIGHT,
				}
				self.setVariableValues({
					ae_mode: AE_OPTION_LABELS[action.options.val] || action.options.val.toString(),
				})
				self.checkFeedbacks('ae_mode_allows_iris', 'ae_mode_allows_shutter', 'ae_mode_manual')
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
		expMCycle: {
			name: 'Exposure Mode Cycle',
			options: [],
			callback: () => {
				const AE_CYCLE = [
					{ label: AE_MODE_AUTO, cmd: '\x01\x04\x39\x00\xFF' },
					{ label: AE_MODE_MANUAL, cmd: '\x01\x04\x39\x03\xFF' },
					{ label: AE_MODE_SHUTTER, cmd: '\x01\x04\x39\x0A\xFF' },
					{ label: AE_MODE_IRIS, cmd: '\x01\x04\x39\x0B\xFF' },
					{ label: AE_MODE_BRIGHT, cmd: '\x01\x04\x39\x0D\xFF' },
				]
				const current = self.getVariableValue('ae_mode')
				const idx = AE_CYCLE.findIndex((m) => m.label === current)
				const next = AE_CYCLE[(idx + 1) % AE_CYCLE.length]
				self.setVariableValues({ ae_mode: next.label })
				self.checkFeedbacks('ae_mode_allows_iris', 'ae_mode_allows_shutter', 'ae_mode_manual')
				self.sendVISCACommand(next.cmd)
			},
		},
		irisU: {
			name: 'Iris Up',
			options: [],
			callback: () => {
				const mode = self.getVariableValue('ae_mode')
				if (mode !== AE_MODE_MANUAL && mode !== AE_MODE_IRIS) {
					self.log('debug', 'Iris Up ignored \u2014 exposure mode does not allow iris control')
					return
				}
				const pos = Number(self.getVariableValue('iris_position') ?? 0)
				const idx = IRIS_POSITIONS.indexOf(pos)
				if (idx === IRIS_POSITIONS.length - 1) {
					self.log('debug', 'Iris Up ignored \u2014 already at maximum (F1.8)')
					return
				}
				const newPos = idx >= 0 ? IRIS_POSITIONS[idx + 1] : (IRIS_POSITIONS.find((p) => p > pos) ?? pos)
				self.setVariableValues({ iris_position: newPos, iris_label: irisLabel(newPos) })
				self.checkFeedbacks('iris_can_increase', 'iris_can_decrease')
				self.sendVISCACommand('\x01\x04\x0B\x02\xFF')
			},
		},
		irisD: {
			name: 'Iris Down',
			options: [],
			callback: () => {
				const mode = self.getVariableValue('ae_mode')
				if (mode !== AE_MODE_MANUAL && mode !== AE_MODE_IRIS) {
					self.log('debug', 'Iris Down ignored \u2014 exposure mode does not allow iris control')
					return
				}
				const pos = Number(self.getVariableValue('iris_position') ?? 0)
				const idx = IRIS_POSITIONS.indexOf(pos)
				if (idx === 0) {
					self.log('debug', 'Iris Down ignored \u2014 already at minimum (Close)')
					return
				}
				const newPos = idx > 0 ? IRIS_POSITIONS[idx - 1] : ([...IRIS_POSITIONS].reverse().find((p) => p < pos) ?? pos)
				self.setVariableValues({ iris_position: newPos, iris_label: irisLabel(newPos) })
				self.checkFeedbacks('iris_can_increase', 'iris_can_decrease')
				self.sendVISCACommand('\x01\x04\x0B\x03\xFF')
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
			callback: (action: any) => {
				self.setVariableValues({ iris_position: parseInt(action.options.val, 16) })
				const cmd = Buffer.from('\x01\x04\x4B\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(action.options.val, 16) & 0xf0) >> 4, 5)
				cmd.writeUInt8(parseInt(action.options.val, 16) & 0x0f, 6)
				self.sendVISCACommand(cmd)
			},
		},
		irisR: {
			name: 'Iris Reset',
			options: [],
			callback: () => {
				const mode = self.getVariableValue('ae_mode')
				if (mode !== AE_MODE_MANUAL && mode !== AE_MODE_IRIS) {
					self.log('debug', 'Iris Reset ignored \u2014 exposure mode does not allow iris control')
					return
				}
				self.sendVISCACommand('\x01\x04\x0B\x00\xFF')
			},
		},
		shutU: {
			name: 'Shutter Up',
			options: [],
			callback: () => {
				const mode = self.getVariableValue('ae_mode')
				if (mode !== AE_MODE_MANUAL && mode !== AE_MODE_SHUTTER) {
					self.log('debug', 'Shutter Up ignored \u2014 exposure mode does not allow shutter control')
					return
				}
				const positions = SHUTTER_POSITIONS
				const pos = Number(self.getVariableValue('shutter_position') ?? 0)
				const idx = positions.indexOf(pos)
				if (idx === positions.length - 1) {
					self.log('debug', 'Shutter Up ignored \u2014 already at maximum')
					return
				}
				const newPos = idx >= 0 ? positions[idx + 1] : (positions.find((p) => p > pos) ?? pos)
				self.setVariableValues({ shutter_position: newPos, shutter_label: shutterLabel(newPos) })
				self.checkFeedbacks('shutter_can_increase', 'shutter_can_decrease')
				self.sendVISCACommand('\x01\x04\x0A\x02\xFF')
			},
		},
		shutD: {
			name: 'Shutter Down',
			options: [],
			callback: () => {
				const mode = self.getVariableValue('ae_mode')
				if (mode !== AE_MODE_MANUAL && mode !== AE_MODE_SHUTTER) {
					self.log('debug', 'Shutter Down ignored \u2014 exposure mode does not allow shutter control')
					return
				}
				const positions = SHUTTER_POSITIONS
				const pos = Number(self.getVariableValue('shutter_position') ?? 0)
				const idx = positions.indexOf(pos)
				if (idx === 0) {
					self.log('debug', 'Shutter Down ignored \u2014 already at minimum')
					return
				}
				const newPos = idx > 0 ? positions[idx - 1] : ([...positions].reverse().find((p) => p < pos) ?? pos)
				self.setVariableValues({ shutter_position: newPos, shutter_label: shutterLabel(newPos) })
				self.checkFeedbacks('shutter_can_increase', 'shutter_can_decrease')
				self.sendVISCACommand('\x01\x04\x0A\x03\xFF')
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
			callback: (action: any) => {
				self.setVariableValues({ shutter_position: parseInt(action.options.val, 16) })
				const cmd = Buffer.from('\x01\x04\x4A\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(action.options.val, 16) & 0xf0) >> 4, 5)
				cmd.writeUInt8(parseInt(action.options.val, 16) & 0x0f, 6)
				self.sendVISCACommand(cmd)
			},
		},
		shutR: {
			name: 'Shutter Reset',
			options: [],
			callback: () => {
				const mode = self.getVariableValue('ae_mode')
				if (mode !== AE_MODE_MANUAL && mode !== AE_MODE_SHUTTER) {
					self.log('debug', 'Shutter Reset ignored \u2014 exposure mode does not allow shutter control')
					return
				}
				self.sendVISCACommand('\x01\x04\x0A\x00\xFF')
			},
		},
		gainU: {
			name: 'Gain Up',
			options: [],
			callback: () => {
				if (self.getVariableValue('ae_mode') !== AE_MODE_MANUAL) {
					self.log('debug', 'Gain Up ignored \u2014 exposure mode is not Manual')
					return
				}
				const pos = Number(self.getVariableValue('gain_position') ?? 0)
				const idx = GAIN_POSITIONS.indexOf(pos)
				if (idx === GAIN_POSITIONS.length - 1) {
					self.log('debug', 'Gain Up ignored \u2014 already at maximum')
					return
				}
				const newPos = idx >= 0 ? GAIN_POSITIONS[idx + 1] : (GAIN_POSITIONS.find((p) => p > pos) ?? pos)
				self.setVariableValues({ gain_position: newPos, gain_label: gainLabel(newPos) })
				self.checkFeedbacks('gain_can_increase', 'gain_can_decrease')
				self.sendVISCACommand('\x01\x04\x0C\x02\xFF')
			},
		},
		gainD: {
			name: 'Gain Down',
			options: [],
			callback: () => {
				if (self.getVariableValue('ae_mode') !== AE_MODE_MANUAL) {
					self.log('debug', 'Gain Down ignored \u2014 exposure mode is not Manual')
					return
				}
				const pos = Number(self.getVariableValue('gain_position') ?? 0)
				const idx = GAIN_POSITIONS.indexOf(pos)
				if (idx === 0) {
					self.log('debug', 'Gain Down ignored \u2014 already at minimum')
					return
				}
				const newPos = idx > 0 ? GAIN_POSITIONS[idx - 1] : ([...GAIN_POSITIONS].reverse().find((p) => p < pos) ?? pos)
				self.setVariableValues({ gain_position: newPos, gain_label: gainLabel(newPos) })
				self.checkFeedbacks('gain_can_increase', 'gain_can_decrease')
				self.sendVISCACommand('\x01\x04\x0C\x03\xFF')
			},
		},
		gainR: {
			name: 'Gain Reset',
			options: [],
			callback: () => {
				if (self.getVariableValue('ae_mode') !== AE_MODE_MANUAL) {
					self.log('debug', 'Gain Reset ignored \u2014 exposure mode is not Manual')
					return
				}
				self.sendVISCACommand('\x01\x04\x0C\x00\xFF')
			},
		},
		wbM: {
			name: 'White Balance Mode',
			options: [
				{
					type: 'dropdown',
					label: 'WB Mode',
					id: 'val',
					choices: WB_MODE,
					default: '0',
				},
			],
			callback: (action: any) => {
				const WB_OPTION_LABELS: Record<number, string> = {
					0: WB_MODE_AUTO,
					1: WB_MODE_INDOOR,
					2: WB_MODE_OUTDOOR,
					3: WB_MODE_ONEPUSH,
					4: WB_MODE_VAR,
					5: WB_MODE_MANUAL,
				}
				self.setVariableValues({
					wb_mode: WB_OPTION_LABELS[action.options.val] || action.options.val.toString(),
				})
				self.checkFeedbacks('wb_mode_manual', 'wb_mode_onepush', 'wb_mode_var')
				const mode = parseInt(action.options.val, 10)
				const cmd = '\x01\x04\x35' + String.fromCharCode(mode) + '\xFF'
				self.sendVISCACommand(cmd)
			},
		},
		wbMCycle: {
			name: 'WB Mode Cycle',
			options: [],
			callback: () => {
				const WB_CYCLE = [
					{ label: WB_MODE_AUTO, val: 0 },
					{ label: WB_MODE_INDOOR, val: 1 },
					{ label: WB_MODE_OUTDOOR, val: 2 },
					{ label: WB_MODE_ONEPUSH, val: 3 },
					{ label: WB_MODE_VAR, val: 4 },
					{ label: WB_MODE_MANUAL, val: 5 },
				]
				const current = self.getVariableValue('wb_mode')
				const idx = WB_CYCLE.findIndex((m) => m.label === current)
				const next = WB_CYCLE[(idx + 1) % WB_CYCLE.length]
				self.setVariableValues({ wb_mode: next.label })
				self.checkFeedbacks('wb_mode_manual', 'wb_mode_onepush', 'wb_mode_var')
				self.sendVISCACommand('\x01\x04\x35' + String.fromCharCode(next.val) + '\xFF')
			},
		},
		wbOnePush: {
			name: 'WB One Push Trigger',
			options: [],
			callback: () => {
				if (self.getVariableValue('wb_mode') !== WB_MODE_ONEPUSH) {
					self.log('debug', 'WB One Push ignored \u2014 WB mode is not OnePush')
					return
				}
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
			callback: (action: any) => {
				if (self.getVariableValue('wb_mode') !== WB_MODE_VAR) {
					self.log('debug', 'Color Temperature ignored \u2014 WB mode is not VAR')
					return
				}
				const kelvin = parseInt(action.options.val, 10)
				// Map Kelvin to camera position byte: 0x0c (2400K) to 0x33 (7100K)
				const pos = Math.round(((kelvin - 2400) * 39) / 4700) + 12
				const cmd = '\x01\x04\x35' + String.fromCharCode(pos) + '\xFF'
				self.setVariableValues({ wb_mode: WB_MODE_VAR, color_temp: kelvin + 'K' })
				self.sendVISCACommand(cmd)
			},
		},
		colorTempCycle: {
			name: 'Color Temperature Cycle',
			options: [],
			callback: () => {
				if (self.getVariableValue('wb_mode') !== WB_MODE_VAR) {
					self.log('debug', 'Color Temperature Cycle ignored \u2014 WB mode is not VAR')
					return
				}
				const temps = [2400, 3000, 3200, 4000, 4500, 5000, 5600, 6500, 7100]
				const current = self.getVariableValue('color_temp')
				const currentKelvin = parseInt(String(current ?? '0'), 10) || 0
				const idx = temps.indexOf(currentKelvin)
				const next = temps[(idx + 1) % temps.length]
				const pos = Math.round(((next - 2400) * 39) / 4700) + 12
				const cmd = '\x01\x04\x35' + String.fromCharCode(pos) + '\xFF'
				self.setVariableValues({ color_temp: next + 'K' })
				self.sendVISCACommand(cmd)
			},
		},
		rgU: {
			name: 'Red Gain Up',
			options: [],
			callback: () => {
				if (self.getVariableValue('wb_mode') !== WB_MODE_MANUAL) {
					self.log('debug', 'Red Gain Up ignored \u2014 WB mode is not Manual')
					return
				}
				self.sendVISCACommand('\x01\x04\x03\x02\xFF')
			},
		},
		rgD: {
			name: 'Red Gain Down',
			options: [],
			callback: () => {
				if (self.getVariableValue('wb_mode') !== WB_MODE_MANUAL) {
					self.log('debug', 'Red Gain Down ignored \u2014 WB mode is not Manual')
					return
				}
				self.sendVISCACommand('\x01\x04\x03\x03\xFF')
			},
		},
		rgR: {
			name: 'Red Gain Reset',
			options: [],
			callback: () => {
				if (self.getVariableValue('wb_mode') !== WB_MODE_MANUAL) {
					self.log('debug', 'Red Gain Reset ignored \u2014 WB mode is not Manual')
					return
				}
				self.sendVISCACommand('\x01\x04\x03\x00\xFF')
			},
		},
		bgU: {
			name: 'Blue Gain Up',
			options: [],
			callback: () => {
				if (self.getVariableValue('wb_mode') !== WB_MODE_MANUAL) {
					self.log('debug', 'Blue Gain Up ignored \u2014 WB mode is not Manual')
					return
				}
				self.sendVISCACommand('\x01\x04\x04\x02\xFF')
			},
		},
		bgD: {
			name: 'Blue Gain Down',
			options: [],
			callback: () => {
				if (self.getVariableValue('wb_mode') !== WB_MODE_MANUAL) {
					self.log('debug', 'Blue Gain Down ignored \u2014 WB mode is not Manual')
					return
				}
				self.sendVISCACommand('\x01\x04\x04\x03\xFF')
			},
		},
		bgR: {
			name: 'Blue Gain Reset',
			options: [],
			callback: () => {
				if (self.getVariableValue('wb_mode') !== WB_MODE_MANUAL) {
					self.log('debug', 'Blue Gain Reset ignored \u2014 WB mode is not Manual')
					return
				}
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
					choices: PRESETS,
					default: PRESETS[0].id,
				},
			],
			callback: (action: any) => {
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
					choices: PRESETS,
					default: PRESETS[0].id,
				},
			],
			callback: (action: any) => {
				const cmd = '\x01\x04\x3F\x02' + String.fromCharCode(parseInt(action.options.val, 16) & 0xff) + '\xFF'
				self.sendVISCACommand(cmd)
				self.pollAllPositions()
			},
		},
		powerToggle: {
			name: 'Power Toggle',
			options: [],
			callback: () => {
				const current = self.getVariableValue('power_state')
				if (current === 'On') {
					self.sendVISCACommand('\x01\x04\x00\x03\xFF')
				} else {
					self.sendVISCACommand('\x01\x04\x00\x02\xFF')
				}
			},
		},
		custom: {
			name: 'Custom command',
			options: [
				{
					type: 'textinput',
					label: 'Custom command (without address byte, e.g. 01 04 00 02 FF)',
					id: 'custom',
					regex: '/^[0-9a-fA-F]{2}(\\s*[0-9a-fA-F]{2})*$/',
					width: 6,
				},
			],
			callback: (action: any) => {
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
			callback: (action: any) => {
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
					choices: PRESETS,
					default: PRESETS[0].id,
				},
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: SPEED,
					default: SPEED[0].id,
				},
			],
			callback: (action: any) => {
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
						{ id: 9, label: 'DATA DISPLAY ON' },
						{ id: 10, label: 'DATA DISPLAY OFF' },
					],
				},
			],
			callback: (action: any) => {
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
					case 9:
						cmd = '\x01\x7E\x01\x18\x02\xFF'
						break
					case 10:
						cmd = '\x01\x7E\x01\x18\x03\xFF'
						break
				}
				self.sendVISCACommand(cmd)
			},
		},
	}

	actions.varBrowseDown = {
		name: 'Variable Browse (press)',
		options: [],
		callback: () => {
			self._browseDownTime = Date.now()
		},
	}
	actions.varBrowseUp = {
		name: 'Variable Browse (release)',
		options: [],
		callback: () => {
			const list = self._browseList || []
			if (list.length === 0) return
			const now = Date.now()
			const held = now - (self._browseDownTime || 0)

			function updateDisplay(): void {
				const entry = list[self._browseIndex || 0]
				const val = self.getVariableValue(entry.variableId)
				self.setVariableValues({
					browse_group: entry.group,
					browse_label: entry.name,
					browse_value: val !== undefined ? String(val) : '\u2014',
				})
			}

			if (held > 600) {
				// Long press -- reset to first (immediate, cancel any pending single)
				clearTimeout(self._browseSingleTimer)
				self._browseSingleTimer = null
				self._browseIndex = 0
				updateDisplay()
				return
			}

			if (self._browseSingleTimer) {
				// Second release arrived before the single-press timer fired -- double press
				clearTimeout(self._browseSingleTimer)
				self._browseSingleTimer = null
				// Undo the speculative single advance
				self._browseIndex = self._browseIndexBeforeSingle
				// Jump to next group
				const currentGroup = list[self._browseIndex || 0].group
				let next = (self._browseIndex || 0) + 1
				while (next < list.length && list[next].group === currentGroup) {
					next++
				}
				self._browseIndex = next < list.length ? next : 0
				updateDisplay()
			} else {
				// Speculatively advance by one, but defer the display update
				self._browseIndexBeforeSingle = self._browseIndex || 0
				self._browseIndex = ((self._browseIndex || 0) + 1) % list.length
				self._browseSingleTimer = setTimeout(() => {
					self._browseSingleTimer = null
					updateDisplay()
				}, 400)
			}
		},
	}

	self.setActionDefinitions(actions)
}
