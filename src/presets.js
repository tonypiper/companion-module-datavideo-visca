const { combineRgb } = require('@companion-module/base')

const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)
const RED = combineRgb(255, 0, 0)
const GREEN = combineRgb(0, 255, 0)

const image_up =
	'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAIFJREFUKM+90EEKgzAQRmFDFy49ghcp5FquVPBighcRegHBjWDJ68D8U6F7m00+EnhkUlW3ru6rdyCV0INQzSg1zFLLKmU2aeCQQMEEJXIQORRsTLNyKJhNm3IoaPBg4mQorp2Mh1+00kKN307o/bZrpt5O/FlPU/c75X91/fPd6wPRD1eHyHEL4wAAAABJRU5ErkJggg=='

const image_down =
	'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAIlJREFUKM/F0DEOwyAMBVAjDxk5Qo7CtdiClIv1KJF6gUpZIhXxY2zTDJ2benoS8LFN9MsKbYjxF2XRS1UZ4bCeGFztFmNqphURpidm146kpwFvLDYJpPQtLSLNoySyP2bRpoqih2oSFW8K3lYAxmJGXA88XMnjeuDmih7XA8vXvNeeqX6U6aY6AacbWAQNWOPUAAAAAElFTkSuQmCC'

const image_left =
	'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAHpJREFUKM+1kTEOgCAQBM9Q2JjwA/mJPA2fxlN4giWF8TRBBhMpbKSaZie3i8gPb4Y8FNZKGm8YIAONkNWacIruQLejy+gyug1dQhfRqZa0v6gYA6QfqSWapZnto1B6XdUuFaVHoJunr2MD21nIdJYUEhLYfoGmP777BKKIXC0eYSD5AAAAAElFTkSuQmCC'

const image_right =
	'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAHhJREFUKM+10LERgCAMQFE4CktHcBRWcRMYzVEcwdKCI+od+fGksVCq3/AuiXOfvZnaNXzRClVrEKtMLdSqP2RTRQAFMAFGwAlw7MAk0sAzGnhVoerLKg/F5Pv4NoFNZZNGpk9sxJYeLsDdL5T7S8IFOM/R3OZ+fQeQZV9pMy+bVgAAAABJRU5ErkJggg=='

const image_up_right =
	'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABhlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+X02G5AAAAgXRSTlMAAte32QZhZx7d+TywDTf8/d5VstYPOxULNvKmSY8TFBrxyeGCluJeELQ5uw7ULND4BedlKuv2P/vDA8UgCk30WO41s8+5X8dABAz6QhHVaR156JpPnihSfTJDNOMBm4bzSICqr23NsRjcGRbtjTCS2lzsOmyu9+WLKb2fTL8+RPDhqO4yAAABfElEQVRYw+3WZW/CUBQG4AO0FBsOwwcMm7sLc3d3d3e788/HGGs7lpD0tsm+9P3S5CT3SdPec+8BkCNHzv9FAVAAEABYdQDkA7jo9GNUIDMBzstb5vr0/Gx8Z35zOjI36R2xbu+619eWa2xCoK0FClF5h1cWxDHEwilEOyLlQc8hokoAlMRcESBh7siQlJBWKkijNaHuPrWBED9iYiDQ7Pv1D4Z4/DXyFo2JgeAghQEkEgAvT6IgNo/PIUmgd62oj80mqEIpINoXRkmg2j2UBDIWVXKLTSXEUIOF/xbV5aRQsJvvUOoqMqjZZ+c7FcX8ThYCtTbxHV0fkEGDA73D3Dpzi/6rWEYAdSn579PZ/t3IBJChkef0dLRlHXdkJ6TSmSnmiYPq1LQIiGHX9BvZYinJ7/+R6q1czUG0j9KSOTxDc6UhshZhMIQrS78mncwZtzErrNcYL6V2Zd0tJ6i7QFtAYPcvHv25W6J+/Y3BrRA/x6WGuGN5mpUjhyyfsGtrpKE95HoAAAAASUVORK5CYII='

const image_down_right =
	'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABXFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jYfXuAAAAc3RSTlMAQ98Ox1j9gAtRNTqBPfgu9p/MTQ+G1Qfx7Y0VBYyJgjkGd3ysU+Zz1IQvMM20PgwBp8Mi4TSUiDvlPxylsaF2WfcjJh0S+wLzQLmY4l/ovX3ra1rPLAOSKa4RUEvgcZwbFHqPzodGbX7qPMvCtsEq1laguT+HEwAAAVlJREFUWMPt1sduwkAQgOGxDfFCIITe0nvvvZHee++992TeX4pJQIC9hPWaQ6T41x6skfY7WGPJAGZm/6qgZjIH4AMgOp2Lq32batTkdW/trPt9+qC70DVmSKS2BXF7A1fX9DDnN2FUSpe8y5hID3SZuJMmrcwmoSFm5vD0BDWSNTnCUmZoD1PZtJCDGfIgRUpBMjPkR4rEAwUtFIkHAkKRuCCaxAdRJE5IK/FCGumWF1JLEW5ILfFD2ST9UBaJA6JLPBCQ57xAJcp5NQbtSgBReJSsH8QI5No8ODo+u397ecL3T35IGhcRA4jig8E9qmjAX2OGnAV5ggrxr0ELOaByVmg6B1TGvEYyTvxcKUaMv/ii7xN/VAZYY2dfSHkkPOYY7Kpf7OmLzLfGPIFGd6izWrRUjdYt9Xfo+ULsLpgRKqGtGyadAEIUmnuhXSAwMAXD5j+omZlZRl+X30CWTm2dHwAAAABJRU5ErkJggg=='

const image_up_left =
	'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABLFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PVkEkAAAAY3RSTlMAAQ/6Uc0OEAvHTzL7TcudsMHvdwnfUwMcG8UGiIfTrIkg9QI+/ZTDe460km73LNovCo1vQUuR4Lwk45/OK+3UERTkekziZlSK8QQnoOsFaaXmLqOylvPZLYDRZTUWUpiTDfAuEmiSAAABUklEQVRYw+3WZ2+DMBAG4EtTygrQ7NHsJt1777333vv+/38o6gIMSo0dqf3AK1lIZ/mRjPEJgCBBgvxtQr8WqDKbCiWUG1AnYXU7C7UJqKQSR5oKQwqIPphsYW24nEPjJCYXilf9F+G+qeTmThTP5w8X8gK9NLqOGMGPhD8fdXtBkGihlmlsmF5aqK2xg9FmQe3/DupuEhTpoT41z/V1HVHfxWRRo/6ORBfyjILx9mRo+2MDlS3ggF5q4uP9qzmVNjfOA+EDdDLcWA8IW6FJEJPkCbFI3hCDZEFVPsmC7mQuyYJ0iUuyIAG4JDvEJTkgHskJcUgExC6RECmxQ4REDa24ILsU6wL/rfYHskmX9C87Pfi9aA5cUmnRx/kffDmncSCkat7X342KSzOIuesNR1WSl7GU8Xfbbs9Gyoo0TvRp6Tie8d2TOsyx51UMEiQIS94B13oTqqYgGGoAAAAASUVORK5CYII='

const image_down_left =
	'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABg1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8aT76cAAAAgHRSTlMAafwJfflezc+3WA7Z5Rk6PAvpBNE73kJT89QxZ48czNIv9A1DnI3qKQUaymjT4a7HdVuGf85LR20CVHr+tLBlA0GvYSTYZEnbAcazNPX4yB4GrAgnmL6Bcj4qIVKIe8kdVadIEe27B90bOG/3Er1rYJq1wibyh+4Q5CMzRllMXDo5euMAAAGfSURBVFjD7dblUwJBGAbw5aSlBJRGQERBkLC7u7u7u7veP90jDnaEcdhjP+k9X5h9Zu43O7PLe4eQECH/KGsIaUooOEcLK75LpehH628idSrE+nMANfyQ3MY2BRm0C6mM462tUwJAJtVyUB1WmsoSFZEk46D6TBcYS3UKPpCYawxD5VxHImVD/RHIxMQbGintkGQcppkcOkuutQPYfkDfmjck556ZTSydve2YY5UWk0Mww672VPh+XFqCU8tA+whtL+KOpa+bF3Rh8B4ymDNaSnSzG9IPIpsL34/HTPZfS58auMPYuYNMWcQXOsD3U9ZDOkZkkCvqwSIqUI2WfEDmgiQxRANiIp8GKtDLO6/Znw19oOdXhKoROtEUBr1F5Y9f4dt1XygqKgh6YqcHwMQkQBWICr1H6czTgrpoQde0IGnekJEWNEwLMv/GPDDB/M/fDioVeLYA5GqoYt+xNRY4toJkCiBUG7vTEVxJu2Z549RbqXQuba7uVDZWO66mgw6d7kYaEPvvCb+REIp/srGzLP4aa0n8zKFkKUSIkD+Qb9QrYMvxAbaBAAAAAElFTkSuQmCC'

module.exports = function (self) {
	const presets = {}

	// Pan/Tilt direction presets
	const ptDirections = [
		{ id: 'pt_up', name: 'UP', action: 'up', image: image_up },
		{ id: 'pt_down', name: 'DOWN', action: 'down', image: image_down },
		{ id: 'pt_left', name: 'LEFT', action: 'left', image: image_left },
		{ id: 'pt_right', name: 'RIGHT', action: 'right', image: image_right },
		{ id: 'pt_up_right', name: 'UP RIGHT', action: 'upRight', image: image_up_right },
		{ id: 'pt_up_left', name: 'UP LEFT', action: 'upLeft', image: image_up_left },
		{ id: 'pt_down_left', name: 'DOWN LEFT', action: 'downLeft', image: image_down_left },
		{ id: 'pt_down_right', name: 'DOWN RIGHT', action: 'downRight', image: image_down_right },
	]

	for (const dir of ptDirections) {
		presets[dir.id] = {
			type: 'button',
			category: 'Pan/Tilt',
			name: dir.name,
			style: {
				style: 'png',
				text: '',
				png64: dir.image,
				pngalignment: 'center:center',
				size: '18',
				color: WHITE,
				bgcolor: BLACK,
			},
			steps: [
				{
					down: [{ actionId: dir.action, options: {} }],
					up: [{ actionId: 'stop', options: {} }],
				},
			],
			feedbacks: [],
		}
	}

	// Home
	presets['pt_home'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Home',
		style: {
			text: 'HOME',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'home', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// PT Speed Up
	presets['pt_speed_up'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Speed Up',
		style: {
			text: 'SPEED\\nUP',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'ptSpeedU', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// PT Speed Down
	presets['pt_speed_down'] = {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Speed Down',
		style: {
			text: 'SPEED\\nDOWN',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'ptSpeedD', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Zoom In
	presets['zoom_in'] = {
		type: 'button',
		category: 'Lens',
		name: 'Zoom In',
		style: {
			text: 'ZOOM\\nIN',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'zoomI', options: {} }],
				up: [{ actionId: 'zoomS', options: {} }],
			},
		],
		feedbacks: [],
	}

	// Zoom Out
	presets['zoom_out'] = {
		type: 'button',
		category: 'Lens',
		name: 'Zoom Out',
		style: {
			text: 'ZOOM\\nOUT',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'zoomO', options: {} }],
				up: [{ actionId: 'zoomS', options: {} }],
			},
		],
		feedbacks: [],
	}

	// Zoom Speed Up
	presets['zoom_speed_up'] = {
		type: 'button',
		category: 'Lens',
		name: 'Speed Up',
		style: {
			text: 'Z SPEED\\nUP',
			size: '14',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'zoomSpeedU', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Zoom Speed Down
	presets['zoom_speed_down'] = {
		type: 'button',
		category: 'Lens',
		name: 'Speed Down',
		style: {
			text: 'Z SPEED\\nDOWN',
			size: '14',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'zoomSpeedD', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Focus Near
	presets['focus_near'] = {
		type: 'button',
		category: 'Lens',
		name: 'Focus Near',
		style: {
			text: 'FOCUS\\nNEAR',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'focusN', options: {} }],
				up: [{ actionId: 'focusS', options: {} }],
			},
		],
		feedbacks: [],
	}

	// Focus Far
	presets['focus_far'] = {
		type: 'button',
		category: 'Lens',
		name: 'Focus Far',
		style: {
			text: 'FOCUS\\nFAR',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'focusF', options: {} }],
				up: [{ actionId: 'focusS', options: {} }],
			},
		],
		feedbacks: [],
	}

	// Auto Focus
	presets['auto_focus'] = {
		type: 'button',
		category: 'Lens',
		name: 'Auto Focus',
		style: {
			text: 'AUTO\\nFOCUS',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'focusM', options: { bol: '0' } }],
				up: [{ actionId: 'focusM', options: { bol: '1' } }],
			},
		],
		feedbacks: [],
	}

	// Exposure Mode
	presets['exp_mode'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Mode',
		style: {
			text: 'EXP\\nMODE',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'expM', options: { val: '0' } }],
				up: [{ actionId: 'expM', options: { val: '1' } }],
			},
		],
		feedbacks: [],
	}

	// Iris Up
	presets['iris_up'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Iris Up',
		style: {
			text: 'IRIS\\nUP',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'irisU', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Iris Down
	presets['iris_down'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Iris Down',
		style: {
			text: 'IRIS\\nDOWN',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'irisD', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Shutter Up
	presets['shutter_up'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Shutter Up',
		style: {
			text: 'Shut\\nUP',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'shutU', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Shutter Down
	presets['shutter_down'] = {
		type: 'button',
		category: 'Exposure',
		name: 'Shutter Down',
		style: {
			text: 'Shut\\nDOWN',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'shutD', options: {} }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Tally GREEN
	presets['tally_green'] = {
		type: 'button',
		category: 'Tally',
		name: 'GREEN',
		style: {
			text: 'GREEN',
			size: '18',
			color: WHITE,
			bgcolor: GREEN,
		},
		steps: [
			{
				down: [{ actionId: 'tally', options: { val: '1' } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Tally RED
	presets['tally_red'] = {
		type: 'button',
		category: 'Tally',
		name: 'RED',
		style: {
			text: 'RED',
			size: '18',
			color: WHITE,
			bgcolor: RED,
		},
		steps: [
			{
				down: [{ actionId: 'tally', options: { val: '0' } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// Tally OFF
	presets['tally_off'] = {
		type: 'button',
		category: 'Tally',
		name: 'OFF',
		style: {
			text: 'OFF',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'tally', options: { val: '2' } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// OSD Menu
	presets['osd_menu'] = {
		type: 'button',
		category: 'OSD',
		name: 'OSD Menu',
		style: {
			text: 'OSD',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'osd', options: { val: 0 } }],
				up: [{ actionId: 'osd', options: { val: 1 } }],
			},
		],
		feedbacks: [],
	}

	// OSD ENTER
	presets['osd_enter'] = {
		type: 'button',
		category: 'OSD',
		name: 'ENTER',
		style: {
			text: 'ENTER',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'osd', options: { val: 2 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// OSD BACK
	presets['osd_back'] = {
		type: 'button',
		category: 'OSD',
		name: 'BACK',
		style: {
			text: 'BACK',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'osd', options: { val: 3 } }],
				up: [],
			},
		],
		feedbacks: [],
	}

	// OSD UP
	presets['osd_up'] = {
		type: 'button',
		category: 'OSD',
		name: 'UP',
		style: {
			style: 'png',
			text: '',
			png64: image_up,
			pngalignment: 'center:center',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'osd', options: { val: 4 } }],
				up: [{ actionId: 'osd', options: { val: 8 } }],
			},
		],
		feedbacks: [],
	}

	// OSD DOWN
	presets['osd_down'] = {
		type: 'button',
		category: 'OSD',
		name: 'DOWN',
		style: {
			style: 'png',
			text: '',
			png64: image_down,
			pngalignment: 'center:center',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'osd', options: { val: 5 } }],
				up: [{ actionId: 'osd', options: { val: 8 } }],
			},
		],
		feedbacks: [],
	}

	// OSD LEFT
	presets['osd_left'] = {
		type: 'button',
		category: 'OSD',
		name: 'LEFT',
		style: {
			style: 'png',
			text: '',
			png64: image_left,
			pngalignment: 'center:center',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'osd', options: { val: 6 } }],
				up: [{ actionId: 'osd', options: { val: 8 } }],
			},
		],
		feedbacks: [],
	}

	// OSD RIGHT
	presets['osd_right'] = {
		type: 'button',
		category: 'OSD',
		name: 'RIGHT',
		style: {
			style: 'png',
			text: '',
			png64: image_right,
			pngalignment: 'center:center',
			size: '18',
			color: WHITE,
			bgcolor: BLACK,
		},
		steps: [
			{
				down: [{ actionId: 'osd', options: { val: 7 } }],
				up: [{ actionId: 'osd', options: { val: 8 } }],
			},
		],
		feedbacks: [],
	}

	// Save Presets (0-62)
	for (let i = 0; i < 63; i++) {
		const hexVal = ('0' + i.toString(16).toUpperCase()).substr(-2, 2)
		presets['save_preset_' + i] = {
			type: 'button',
			category: 'Save Preset',
			name: 'Save Preset ' + (i + 1),
			style: {
				text: 'SAVE\\nPSET\\n' + (i + 1),
				size: '14',
				color: WHITE,
				bgcolor: BLACK,
			},
			steps: [
				{
					down: [{ actionId: 'savePset', options: { val: hexVal } }],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	// Recall Presets (0-62)
	for (let i = 0; i < 63; i++) {
		const hexVal = ('0' + i.toString(16).toUpperCase()).substr(-2, 2)
		presets['recall_preset_' + i] = {
			type: 'button',
			category: 'Recall Preset',
			name: 'Recall Preset ' + (i + 1),
			style: {
				text: 'Recall\\nPSET\\n' + (i + 1),
				size: '14',
				color: WHITE,
				bgcolor: BLACK,
			},
			steps: [
				{
					down: [{ actionId: 'recallPset', options: { val: hexVal } }],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	self.setPresetDefinitions(presets)
}
