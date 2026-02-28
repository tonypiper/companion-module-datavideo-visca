import type {
	CompanionStaticUpgradeScript,
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
	CompanionUpgradeContext,
} from '@companion-module/base'

// Local interface matching the module config shape.
// This avoids importing from main.js which is not yet converted to TypeScript.
interface DatavideoViscaConfig {
	host?: string
	port?: number
	httpApi?: boolean
	httpPort?: number
	httpPollInterval?: number
}

export const UpgradeScripts: CompanionStaticUpgradeScript<DatavideoViscaConfig>[] = [
	function addHttpApiDefaults(
		_context: CompanionUpgradeContext<DatavideoViscaConfig>,
		props: CompanionStaticUpgradeProps<DatavideoViscaConfig>,
	): CompanionStaticUpgradeResult<DatavideoViscaConfig> {
		const result: CompanionStaticUpgradeResult<DatavideoViscaConfig> = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

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
