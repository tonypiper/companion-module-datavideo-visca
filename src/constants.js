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
	{ id: '06', label: 'F11.0' },
	{ id: '05', label: 'F14.0' },
	{ id: '00', label: 'Close' },
]

// VISCA shutter positions 5-21
// 25fps and 50/60fps use the same VISCA positions but different speeds
// We show both where they differ: "60fps (25fps)"
const SHUTTER = [
	{ id: '05', label: '1/30 (1/25)' },
	{ id: '06', label: '1/60 (1/50)' },
	{ id: '07', label: '1/90 (1/75)' },
	{ id: '08', label: '1/100' },
	{ id: '09', label: '1/125 (1/120)' },
	{ id: '0A', label: '1/180 (1/150)' },
	{ id: '0B', label: '1/250 (1/215)' },
	{ id: '0C', label: '1/350 (1/300)' },
	{ id: '0D', label: '1/500 (1/425)' },
	{ id: '0E', label: '1/725 (1/600)' },
	{ id: '0F', label: '1/1000' },
	{ id: '10', label: '1/1500 (1/1250)' },
	{ id: '11', label: '1/2000 (1/1750)' },
	{ id: '12', label: '1/3000 (1/2500)' },
	{ id: '13', label: '1/4000 (1/3500)' },
	{ id: '14', label: '1/6000' },
	{ id: '15', label: '1/10000' },
]

// Gain: 0dB to 42dB in 3dB steps (VISCA positions 1-15)
const GAIN = []
for (let i = 0; i <= 14; i++) {
	GAIN.push({ id: ('0' + (i + 1).toString(16)).substr(-2, 2), label: i * 3 + 'dB' })
}

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

// Canonical variable value strings (used by inquiry parsers and action guards)
const FOCUS_MODE_AUTO = 'Auto'
const FOCUS_MODE_MANUAL = 'Manual'

const AE_MODE_AUTO = 'Auto'
const AE_MODE_MANUAL = 'Manual'
const AE_MODE_SHUTTER = 'Shutter'
const AE_MODE_IRIS = 'Iris'
const AE_MODE_BRIGHT = 'Bright'

const WB_MODE_AUTO = 'Auto'
const WB_MODE_INDOOR = 'Indoor'
const WB_MODE_OUTDOOR = 'Outdoor'
const WB_MODE_ONEPUSH = 'OnePush'
const WB_MODE_VAR = 'VAR'
const WB_MODE_MANUAL = 'Manual'

const IRIS_LABELS = Object.fromEntries(IRIS.map((i) => [parseInt(i.id, 16), i.label]))
const IRIS_POSITIONS = IRIS.map((i) => parseInt(i.id, 16)).sort((a, b) => a - b)
const SHUTTER_LABELS = Object.fromEntries(SHUTTER.map((s) => [parseInt(s.id, 16), s.label]))
const SHUTTER_POSITIONS = SHUTTER.map((s) => parseInt(s.id, 16)).sort((a, b) => a - b)
const GAIN_LABELS = Object.fromEntries(GAIN.map((g) => [parseInt(g.id, 16), g.label]))
const GAIN_POSITIONS = GAIN.map((g) => parseInt(g.id, 16)).sort((a, b) => a - b)

module.exports = {
	IRIS,
	IRIS_LABELS,
	IRIS_POSITIONS,
	SHUTTER,
	SHUTTER_LABELS,
	SHUTTER_POSITIONS,
	GAIN,
	GAIN_LABELS,
	GAIN_POSITIONS,
	PRESET,
	FOCUS_MODE,
	EXPOSURE_MODE,
	WB_MODE,
	SPEED,
	CHOICE_ZOOMSPEED,
	FOCUS_MODE_AUTO,
	FOCUS_MODE_MANUAL,
	AE_MODE_AUTO,
	AE_MODE_MANUAL,
	AE_MODE_SHUTTER,
	AE_MODE_IRIS,
	AE_MODE_BRIGHT,
	WB_MODE_AUTO,
	WB_MODE_INDOOR,
	WB_MODE_OUTDOOR,
	WB_MODE_ONEPUSH,
	WB_MODE_VAR,
	WB_MODE_MANUAL,
}
