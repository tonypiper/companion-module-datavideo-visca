import { COLOR, IMAGE, ActionId } from './constants.js'
export function getPresets() {
	const presets = {
		up: {
			type: 'button',
			category: 'Pan/Tilt',
			name: 'UP',
			style: {
				text: '',
				png64: IMAGE.up,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.up }],
					up: [{ actionId: ActionId.stop }],
				},
			],
		},
		down: {
			type: 'button',
			category: 'Pan/Tilt',
			name: 'DOWN',
			style: {
				text: '',
				png64: IMAGE.down,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.down }],
					up: [{ actionId: ActionId.stop }],
				},
			],
		},
		left: {
			type: 'button',
			category: 'Pan/Tilt',
			name: 'LEFT',
			style: {
				text: '',
				png64: IMAGE.left,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.left }],
					up: [{ actionId: ActionId.stop }],
				},
			],
		},
		right: {
			type: 'button',
			category: 'Pan/Tilt',
			name: 'RIGHT',
			style: {
				text: '',
				png64: IMAGE.right,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.right }],
					up: [{ actionId: ActionId.stop }],
				},
			],
		},
		upRight: {
			type: 'button',
			category: 'Pan/Tilt',
			name: 'UP RIGHT',
			style: {
				text: '',
				png64: IMAGE.up_right,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.upRight }],
					up: [{ actionId: ActionId.stop }],
				},
			],
		},
		upLeft: {
			type: 'button',
			category: 'Pan/Tilt',
			name: 'UP LEFT',
			style: {
				text: '',
				png64: IMAGE.up_left,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.upLeft }],
					up: [{ actionId: ActionId.stop }],
				},
			],
		},
		downLeft: {
			type: 'button',
			category: 'Pan/Tilt',
			name: 'DOWN LEFT',
			style: {
				text: '',
				png64: IMAGE.down_left,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.downLeft }],
					up: [{ actionId: ActionId.stop }],
				},
			],
		},
		downRight: {
			type: 'button',
			category: 'Pan/Tilt',
			name: 'DOWN RIGHT',
			style: {
				text: '',
				png64: IMAGE.down_right,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.downRight }],
					up: [{ actionId: ActionId.stop }],
				},
			],
		},
		home: {
			type: 'button',
			category: 'Pan/Tilt',
			name: 'Home',
			style: {
				text: 'HOME',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.home }],
					up: [],
				},
			],
		},
		speedUp: {
			type: 'button',
			category: 'Pan/Tilt',
			name: 'Speed Up',
			style: {
				text: 'SPEED\\nUP',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.ptSpeedU }],
					up: [],
				},
			],
		},
		speedDown: {
			type: 'button',
			category: 'Pan/Tilt',
			name: 'Speed Down',
			style: {
				text: 'SPEED\\nDOWN',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.ptSpeedD }],
					up: [],
				},
			],
		},
		zoomIn: {
			type: 'button',
			category: 'Lens',
			name: 'Zoom In',
			style: {
				text: 'ZOOM\\nIN',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.zoomI }],
					up: [{ actionId: ActionId.zoomS }],
				},
			],
		},
		zoomOut: {
			type: 'button',
			category: 'Lens',
			name: 'Zoom Out',
			style: {
				text: 'ZOOM\\nOUT',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.zoomO }],
					up: [{ actionId: ActionId.stop }],
				},
			],
		},
		zoomSpeedUp: {
			type: 'button',
			category: 'Lens',
			name: 'Speed Up',
			style: {
				text: 'Z SPEED\\nUP',
				size: '14',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.zoomSpeedU }],
					up: [],
				},
			],
		},
		zoomSpeedDown: {
			type: 'button',
			category: 'Lens',
			name: 'Speed Down',
			style: {
				text: 'Z SPEED\\nDOWN',
				size: '14',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.zoomSpeedD }],
					up: [],
				},
			],
		},
		focusNear: {
			type: 'button',
			category: 'Lens',
			name: 'Focus Near',
			style: {
				text: 'FOCUS\\nNEAR',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.focusN }],
					up: [{ actionId: ActionId.focusS }],
				},
			],
		},
		focusFar: {
			type: 'button',
			category: 'Lens',
			name: 'Focus Far',
			style: {
				text: 'FOCUS\\nFAR',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.focusF }],
					up: [{ actionId: ActionId.focusS }],
				},
			],
		},
		focusAuto: {
			type: 'button',
			category: 'Lens',
			name: 'Auto Focus',
			style: {
				text: 'AUTO\\nFOCUS',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.focusM, options: { bol: 0 } }],
					up: [],
				},
				{
					down: [{ actionId: ActionId.focusM, options: { bol: 1 } }],
					up: [],
				},
			],
		},
		exposureMode: {
			type: 'button',
			category: 'Exposure',
			name: 'Exposure Mode',
			style: {
				text: 'EXP\\nMODE',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.expM, options: { bol: 0 } }],
					up: [],
				},
				{
					down: [{ actionId: ActionId.expM, options: { bol: 1 } }],
					up: [],
				},
			],
		},
		irisUp: {
			type: 'button',
			category: 'Exposure',
			name: 'Iris Up',
			style: {
				text: 'IRIS\\nUP',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.irisU }],
					up: [],
				},
			],
		},
		irisDown: {
			type: 'button',
			category: 'Exposure',
			name: 'Iris Down',
			style: {
				text: 'IRIS\\nDOWN',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.irisD }],
					up: [],
				},
			],
		},
		shutterUp: {
			type: 'button',
			category: 'Exposure',
			name: 'Shutter Up',
			style: {
				text: 'Shut\\nUP',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.shutU }],
					up: [],
				},
			],
		},
		shutterDown: {
			type: 'button',
			category: 'Exposure',
			name: 'Shutter Down',
			style: {
				text: 'Shut\\nDOWN',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.shutD }],
					up: [],
				},
			],
		},
		tallyGreen: {
			type: 'button',
			category: 'Tally',
			name: 'GREEN',
			style: {
				text: 'GREEN',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.green,
			},
			steps: [
				{
					down: [{ actionId: ActionId.tally, options: { val: 1 } }],
					up: [],
				},
			],
		},
		tallyRed: {
			type: 'button',
			category: 'Tally',
			name: 'RED',
			style: {
				text: 'RED',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.red,
			},
			steps: [
				{
					down: [{ actionId: ActionId.tally, options: { val: 0 } }],
					up: [],
				},
			],
		},
		tallyOff: {
			type: 'button',
			category: 'Tally',
			name: 'OFF',
			style: {
				text: 'OFF',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.tally, options: { val: 2 } }],
					up: [],
				},
			],
		},
		osdMenu: {
			type: 'button',
			category: 'OSD',
			name: 'OSD Menu',
			style: {
				text: 'OSD',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.osd, options: { val: 0 } }],
					up: [],
				},
				{
					down: [{ actionId: ActionId.osd, options: { val: 1 } }],
					up: [],
				},
			],
		},
		osdEnter: {
			type: 'button',

			category: 'OSD',
			name: 'ENTER',
			style: {
				text: 'ENTER',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.osd, options: { val: 2 } }],
					up: [],
				},
			],
		},
		osdBack: {
			type: 'button',

			category: 'OSD',
			name: 'BACK',
			style: {
				text: 'BACK',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.osd, options: { val: 3 } }],
					up: [],
				},
			],
		},
		osdUp: {
			type: 'button',

			category: 'OSD',
			name: 'UP',
			style: {
				text: '',
				png64: IMAGE.up,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.osd, options: { val: 4 } }],
					up: [{ actionId: ActionId.osd, options: { val: 8 } }],
				},
			],
		},
		osdDown: {
			type: 'button',

			category: 'OSD',
			name: 'DOWN',
			style: {
				text: '',
				png64: IMAGE.down,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.osd, options: { val: 5 } }],
					up: [{ actionId: ActionId.osd, options: { val: 8 } }],
				},
			],
		},
		oseLeft: {
			type: 'button',

			category: 'OSD',
			name: 'LEFT',
			style: {
				text: '',
				png64: IMAGE.left,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.osd, options: { val: 6 } }],
					up: [{ actionId: ActionId.osd, options: { val: 8 } }],
				},
			],
		},
		osdRight: {
			type: 'button',

			category: 'OSD',
			name: 'RIGHT',
			style: {
				text: '',
				png64: IMAGE.right,
				pngalignment: 'center:center',
				size: '18',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [{ actionId: ActionId.osd, options: { val: 7 } }],
					up: [{ actionId: ActionId.osd, options: { val: 8 } }],
				},
			],
		},
	}

	let save
	for (save = 0; save < 63; save++) {
		presets[`save${save + 1}`] = {
			type: 'button',
			category: 'Save Preset',
			name: `Save Preset ${parseInt(save + 1)}`,
			style: {
				text: `SAVE\\nPSET\\n${parseInt(save + 1)}`,
				size: '14',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [
						{
							actionId: 'savePset',
							options: {
								val: `0${save.toString(16).toUpperCase()}`.slice(-2),
							},
						},
					],
					up: [],
				},
			],
		}
	}

	let recall
	for (recall = 0; recall < 63; recall++) {
		presets[`recall${recall + 1}`] = {
			type: 'button',
			category: 'Recall Preset',
			name: `Recall Preset ${parseInt(recall + 1)}`,
			style: {
				text: `Recall\\nPSET\\n${parseInt(recall + 1)}`,
				size: '14',
				color: COLOR.white,
				bgcolor: COLOR.black,
			},
			steps: [
				{
					down: [
						{
							actionId: 'recallPset',
							options: {
								val: `0${recall.toString(16).toUpperCase()}`.slice(-2),
							},
						},
					],
					up: [],
				},
			],
		}
	}

	return presets
}
