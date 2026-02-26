module.exports = [
	function addHttpApiDefaults(_context, props) {
		const result = { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }

		if (props.config) {
			const config = props.config
			let changed = false

			if (config.httpPort === undefined || config.httpPort === 0) {
				config.httpPort = 80
				changed = true
			}
			if (config.httpPollInterval === undefined || config.httpPollInterval === 0) {
				config.httpPollInterval = 3000
				changed = true
			}

			if (changed) {
				result.updatedConfig = config
			}
		}

		return result
	},
]
