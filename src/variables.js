module.exports = function (self) {
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

	if (self.config.httpApi) {
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
			{ variableId: 'http_exp_comp', name: 'Exposure Compensation [HTTP]' },
			{ variableId: 'http_exp_comp_enabled', name: 'Exp Comp Enabled [HTTP]' },
			{ variableId: 'http_anti_flicker', name: 'Anti-Flicker Mode [HTTP]' },
			{ variableId: 'http_slow_shutter', name: 'Slow Shutter [HTTP]' },
			{ variableId: 'http_model_name', name: 'Camera Model [HTTP]' },
			{ variableId: 'http_firmware_version', name: 'Firmware Version [HTTP]' },
		)
	}

	vars.push(
		{ variableId: 'browse_label', name: 'Browse: Current Label' },
		{ variableId: 'browse_value', name: 'Browse: Current Value' },
	)

	// Store browsable list (everything except the browse variables themselves)
	self._browseList = vars.filter((v) => v.variableId !== 'browse_label' && v.variableId !== 'browse_value')

	self.setVariableDefinitions(vars)
}
