module.exports = function (self) {
	self.setFeedbackDefinitions({
		focus_mode_manual: {
			type: 'boolean',
			name: 'Focus Mode is Manual',
			description: 'True when the camera focus mode is set to Manual',
			defaultStyle: {},
			options: [],
			callback: () => {
				return self.getVariableValue('focus_mode') === 'Manual'
			},
		},
	})
}
