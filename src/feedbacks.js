const {
	FOCUS_MODE_MANUAL,
	AE_MODE_MANUAL,
	AE_MODE_SHUTTER,
	AE_MODE_IRIS,
	WB_MODE_MANUAL,
	WB_MODE_ONEPUSH,
	WB_MODE_VAR,
} = require('./constants')

module.exports = function (self) {
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
	})
}
