const IRIS = [
	{ id: '11', label: 'F1.8' },
	{ id: '10', label: 'F2.0' },
	{ id: '0F', label: 'F2.4' },
	{ id: '0E', label: 'F2.8' },
	{ id: '0D', label: 'F3.4' },
	{ id: '0C', label: 'F4.0' },
	{ id: '0B', label: 'F4.8' },
	{ id: '0A', label: 'F5.6' },
	{ id: '09', label: 'F6.8' },
	{ id: '08', label: 'F8.0' },
	{ id: '07', label: 'F9.6' },
	{ id: '06', label: 'F11' },
	{ id: '00', label: 'CLOSED' },
]

const SHUTTER = [
	{ id: '11', label: '1/1000000' },
	{ id: '10', label: '1/6000' },
	{ id: '0F', label: '1/4000' },
	{ id: '0E', label: '1/3000' },
	{ id: '0D', label: '1/2000' },
	{ id: '0C', label: '1/1500' },
	{ id: '0B', label: '1/1000' },
	{ id: '0A', label: '1/725' },
	{ id: '09', label: '1/500' },
	{ id: '08', label: '1/350' },
	{ id: '07', label: '1/250' },
	{ id: '06', label: '1/180' },
	{ id: '05', label: '1/125' },
	{ id: '04', label: '1/100' },
	{ id: '03', label: '1/90' },
	{ id: '02', label: '1/60' },
	{ id: '01', label: '1/30' },
]

const PRESET = []
for (let i = 1; i <= 64; ++i) {
	PRESET.push({ id: ('0' + i.toString(16)).substr(-2, 2), label: 'Preset ' + i })
}

const FOCUS_MODE = [
	{ id: '0', label: 'Auto' },
	{ id: '1', label: 'Manual' },
]

const EXPOSURE_MODE = [
	{ id: '0', label: 'Full Auto' },
	{ id: '1', label: 'Manual' },
	{ id: '2', label: 'Shutter Pri' },
	{ id: '3', label: 'Iris Pri' },
	{ id: '4', label: 'Bright' },
]

const WB_MODE = [
	{ id: '0', label: 'Auto' },
	{ id: '1', label: 'Indoor' },
	{ id: '2', label: 'Outdoor' },
	{ id: '3', label: 'One Push' },
	{ id: '4', label: 'VAR' },
	{ id: '5', label: 'Manual' },
]

const SPEED = [
	{ id: '01', label: 'Speed 01 (Slow)' },
	{ id: '02', label: 'Speed 02' },
	{ id: '03', label: 'Speed 03' },
	{ id: '04', label: 'Speed 04' },
	{ id: '05', label: 'Speed 05' },
	{ id: '06', label: 'Speed 06' },
	{ id: '07', label: 'Speed 07' },
	{ id: '08', label: 'Speed 08' },
	{ id: '09', label: 'Speed 09' },
	{ id: '0A', label: 'Speed 10' },
	{ id: '0B', label: 'Speed 11' },
	{ id: '0C', label: 'Speed 12' },
	{ id: '0D', label: 'Speed 13' },
	{ id: '0E', label: 'Speed 14' },
	{ id: '0F', label: 'Speed 15' },
	{ id: '10', label: 'Speed 16' },
	{ id: '11', label: 'Speed 17' },
	{ id: '12', label: 'Speed 18' },
	{ id: '13', label: 'Speed 19' },
	{ id: '14', label: 'Speed 20' },
	{ id: '15', label: 'Speed 21' },
	{ id: '16', label: 'Speed 22' },
	{ id: '17', label: 'Speed 23' },
	{ id: '18', label: 'Speed 24 (Fast)' },
]

const CHOICE_ZOOMSPEED = [
	{ id: '00', label: 'Speed 00 (Default)' },
	{ id: '01', label: 'Speed 01 (Slow)' },
	{ id: '02', label: 'Speed 02' },
	{ id: '03', label: 'Speed 03' },
	{ id: '04', label: 'Speed 04' },
	{ id: '05', label: 'Speed 05' },
	{ id: '06', label: 'Speed 06' },
	{ id: '07', label: 'Speed 07 (Fast)' },
]

module.exports = { IRIS, SHUTTER, PRESET, FOCUS_MODE, EXPOSURE_MODE, WB_MODE, SPEED, CHOICE_ZOOMSPEED }
