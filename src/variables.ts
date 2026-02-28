import type { InstanceBase } from '@companion-module/base'

interface BrowseEntry {
	variableId: string
	name: string
	group: string
}

export function initVariables(self: InstanceBase<any>): void {
	const config = (self as any).config

	const vars = [
		{
			variableId: 'pt_speed',
			name: 'Pan/Tilt Speed',
		},
		{
			variableId: 'zoom_speed',
			name: 'Zoom Speed',
		},
		{
			variableId: 'zoom_position',
			name: 'Zoom Position (%)',
		},
		{
			variableId: 'focus_position',
			name: 'Focus Position',
		},
		{
			variableId: 'focus_mode',
			name: 'Focus Mode',
		},
		{
			variableId: 'power_state',
			name: 'Power State',
		},
		{
			variableId: 'ae_mode',
			name: 'AE Mode',
		},
		{
			variableId: 'iris_position',
			name: 'Iris Position',
		},
		{
			variableId: 'iris_label',
			name: 'Iris Label',
		},
		{
			variableId: 'shutter_position',
			name: 'Shutter Position',
		},
		{
			variableId: 'shutter_label',
			name: 'Shutter Label',
		},
		{
			variableId: 'gain_position',
			name: 'Gain Position',
		},
		{
			variableId: 'gain_label',
			name: 'Gain Label',
		},
		{
			variableId: 'wb_mode',
			name: 'White Balance Mode',
		},
		{
			variableId: 'color_temp',
			name: 'Color Temperature (K)',
		},
		{
			variableId: 'rg_position',
			name: 'Red Gain Position',
		},
		{
			variableId: 'bg_position',
			name: 'Blue Gain Position',
		},
		{
			variableId: 'backlight',
			name: 'Backlight',
		},
		{
			variableId: 'pan_position',
			name: 'Pan Position',
		},
		{
			variableId: 'tilt_position',
			name: 'Tilt Position',
		},
	]

	if (config.httpApi) {
		vars.push(
			{ variableId: 'http_hue', name: 'Hue (-15 to +15) [HTTP]' },
			{ variableId: 'http_saturation', name: 'Saturation [HTTP]' },
			{ variableId: 'http_luminance', name: 'Luminance [HTTP]' },
			{ variableId: 'http_contrast', name: 'Contrast [HTTP]' },
			{ variableId: 'http_sharpness', name: 'Sharpness [HTTP]' },
			{ variableId: 'http_gamma', name: 'Gamma [HTTP]' },
			{ variableId: 'http_noise_2d', name: '2D Noise Reduction [HTTP]' },
			{ variableId: 'http_noise_3d', name: '3D Noise Reduction [HTTP]' },
			{ variableId: 'http_gain_limit', name: 'Gain Limit [HTTP]' },
			{ variableId: 'http_gain_limit_label', name: 'Gain Limit (dB) [HTTP]' },
			{ variableId: 'http_exp_comp', name: 'Exposure Compensation [HTTP]' },
			{ variableId: 'http_exp_comp_enabled', name: 'Exp Comp Enabled [HTTP]' },
			{ variableId: 'http_anti_flicker', name: 'Anti-Flicker Mode [HTTP]' },
			{ variableId: 'http_slow_shutter', name: 'Slow Shutter [HTTP]' },
			{ variableId: 'http_model_name', name: 'Camera Model [HTTP]' },
			{ variableId: 'http_firmware_version', name: 'Firmware Version [HTTP]' },
		)
	}

	vars.push(
		{ variableId: 'browse_group', name: 'Browse: Current Group' },
		{ variableId: 'browse_label', name: 'Browse: Current Label' },
		{ variableId: 'browse_value', name: 'Browse: Current Value' },
	)

	// Browse order: grouped for phone troubleshooting
	// 1. Identity/connection  2. Position  3. Exposure  4. White balance  5. Image processing  6. Internal
	const G = { ID: 'ID', POS: 'POS', EXP: 'EXP', WB: 'WB', IMG: 'IMG', INT: 'INT' }
	const browseOrder: BrowseEntry[] = [
		// Identity & connection
		{ variableId: 'power_state', name: 'Power', group: G.ID },
		{ variableId: 'http_model_name', name: 'Model', group: G.ID },
		{ variableId: 'http_firmware_version', name: 'Firmware', group: G.ID },
		// Position
		{ variableId: 'pan_position', name: 'Pan', group: G.POS },
		{ variableId: 'tilt_position', name: 'Tilt', group: G.POS },
		{ variableId: 'zoom_position', name: 'Zoom', group: G.POS },
		{ variableId: 'focus_position', name: 'Focus Pos', group: G.POS },
		{ variableId: 'focus_mode', name: 'Focus Mode', group: G.POS },
		// Exposure
		{ variableId: 'ae_mode', name: 'AE Mode', group: G.EXP },
		{ variableId: 'iris_label', name: 'Iris', group: G.EXP },
		{ variableId: 'shutter_label', name: 'Shutter', group: G.EXP },
		{ variableId: 'gain_label', name: 'Gain', group: G.EXP },
		{ variableId: 'http_gain_limit_label', name: 'Gain Limit', group: G.EXP },
		{ variableId: 'http_exp_comp', name: 'Exp Comp', group: G.EXP },
		{ variableId: 'http_exp_comp_enabled', name: 'Exp Comp En', group: G.EXP },
		{ variableId: 'backlight', name: 'Backlight', group: G.EXP },
		{ variableId: 'http_anti_flicker', name: 'Anti-Flicker', group: G.EXP },
		{ variableId: 'http_slow_shutter', name: 'Slow Shutter', group: G.EXP },
		// White balance
		{ variableId: 'wb_mode', name: 'WB Mode', group: G.WB },
		{ variableId: 'color_temp', name: 'Color Temp', group: G.WB },
		{ variableId: 'rg_position', name: 'Red Gain', group: G.WB },
		{ variableId: 'bg_position', name: 'Blue Gain', group: G.WB },
		// Image processing
		{ variableId: 'http_hue', name: 'Hue', group: G.IMG },
		{ variableId: 'http_saturation', name: 'Saturation', group: G.IMG },
		{ variableId: 'http_luminance', name: 'Luminance', group: G.IMG },
		{ variableId: 'http_contrast', name: 'Contrast', group: G.IMG },
		{ variableId: 'http_sharpness', name: 'Sharpness', group: G.IMG },
		{ variableId: 'http_gamma', name: 'Gamma', group: G.IMG },
		{ variableId: 'http_noise_2d', name: 'NR 2D', group: G.IMG },
		{ variableId: 'http_noise_3d', name: 'NR 3D', group: G.IMG },
		// Internal
		{ variableId: 'pt_speed', name: 'PT Speed', group: G.INT },
		{ variableId: 'zoom_speed', name: 'Zoom Speed', group: G.INT },
	]

	// Only include variables that are currently defined
	const definedIds = new Set(vars.map((v) => v.variableId))
	const browseSkip = new Set(['browse_group', 'browse_label', 'browse_value'])
	;(self as any)._browseList = browseOrder.filter((v) => definedIds.has(v.variableId) && !browseSkip.has(v.variableId))

	self.setVariableDefinitions(vars)
}
