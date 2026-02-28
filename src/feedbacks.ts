import type { InstanceBase } from '@companion-module/base'
import type { DatavideoViscaConfig } from './main.js'
import {
	FOCUS_MODE_MANUAL,
	AE_MODE_MANUAL,
	AE_MODE_SHUTTER,
	AE_MODE_IRIS,
	WB_MODE_MANUAL,
	WB_MODE_ONEPUSH,
	WB_MODE_VAR,
	IRIS_POSITIONS,
	SHUTTER_POSITIONS,
	GAIN_POSITIONS,
} from './constants.js'

export function initFeedbacks(self: InstanceBase<DatavideoViscaConfig>): void {
	self.setFeedbackDefinitions({
		focus_mode_manual: {
			type: 'boolean',
			name: 'Focus Mode is Manual',
			description: 'True when the camera focus mode is set to Manual',
			defaultStyle: {},
			options: [],
			callback: () => {
				return self.getVariableValue('focus_mode') === FOCUS_MODE_MANUAL
			},
		},
		ae_mode_allows_iris: {
			type: 'boolean',
			name: 'Exposure Mode Allows Iris',
			description: 'True when the exposure mode is Manual or Iris',
			defaultStyle: {},
			options: [],
			callback: () => {
				const mode = self.getVariableValue('ae_mode')
				return mode === AE_MODE_MANUAL || mode === AE_MODE_IRIS
			},
		},
		ae_mode_allows_shutter: {
			type: 'boolean',
			name: 'Exposure Mode Allows Shutter',
			description: 'True when the exposure mode is Manual or Shutter',
			defaultStyle: {},
			options: [],
			callback: () => {
				const mode = self.getVariableValue('ae_mode')
				return mode === AE_MODE_MANUAL || mode === AE_MODE_SHUTTER
			},
		},
		ae_mode_manual: {
			type: 'boolean',
			name: 'Exposure Mode is Manual',
			description: 'True when the exposure mode is set to Manual',
			defaultStyle: {},
			options: [],
			callback: () => {
				return self.getVariableValue('ae_mode') === AE_MODE_MANUAL
			},
		},
		wb_mode_manual: {
			type: 'boolean',
			name: 'WB Mode is Manual',
			description: 'True when the white balance mode is set to Manual',
			defaultStyle: {},
			options: [],
			callback: () => {
				return self.getVariableValue('wb_mode') === WB_MODE_MANUAL
			},
		},
		wb_mode_onepush: {
			type: 'boolean',
			name: 'WB Mode is OnePush',
			description: 'True when the white balance mode is set to OnePush',
			defaultStyle: {},
			options: [],
			callback: () => {
				return self.getVariableValue('wb_mode') === WB_MODE_ONEPUSH
			},
		},
		wb_mode_var: {
			type: 'boolean',
			name: 'WB Mode is VAR',
			description: 'True when the white balance mode is set to VAR',
			defaultStyle: {},
			options: [],
			callback: () => {
				return self.getVariableValue('wb_mode') === WB_MODE_VAR
			},
		},
		iris_can_increase: {
			type: 'boolean',
			name: 'Iris Can Increase',
			description: 'True when the iris is below its maximum (F1.8)',
			defaultStyle: {},
			options: [],
			callback: () => {
				return (self.getVariableValue('iris_position') as number) < IRIS_POSITIONS[IRIS_POSITIONS.length - 1]
			},
		},
		iris_can_decrease: {
			type: 'boolean',
			name: 'Iris Can Decrease',
			description: 'True when the iris is above its minimum (Close)',
			defaultStyle: {},
			options: [],
			callback: () => {
				return (self.getVariableValue('iris_position') as number) > IRIS_POSITIONS[0]
			},
		},
		shutter_can_increase: {
			type: 'boolean',
			name: 'Shutter Can Increase',
			description: 'True when the shutter is below its maximum (1/10000)',
			defaultStyle: {},
			options: [],
			callback: () => {
				return (self.getVariableValue('shutter_position') as number) < SHUTTER_POSITIONS[SHUTTER_POSITIONS.length - 1]
			},
		},
		shutter_can_decrease: {
			type: 'boolean',
			name: 'Shutter Can Decrease',
			description: 'True when the shutter is above its minimum (1/30)',
			defaultStyle: {},
			options: [],
			callback: () => {
				return (self.getVariableValue('shutter_position') as number) > SHUTTER_POSITIONS[0]
			},
		},
		gain_can_increase: {
			type: 'boolean',
			name: 'Gain Can Increase',
			description: 'True when the gain is below its maximum (42dB)',
			defaultStyle: {},
			options: [],
			callback: () => {
				return (self.getVariableValue('gain_position') as number) < GAIN_POSITIONS[GAIN_POSITIONS.length - 1]
			},
		},
		gain_can_decrease: {
			type: 'boolean',
			name: 'Gain Can Decrease',
			description: 'True when the gain is above its minimum (0dB)',
			defaultStyle: {},
			options: [],
			callback: () => {
				return (self.getVariableValue('gain_position') as number) > GAIN_POSITIONS[0]
			},
		},
	})
}
