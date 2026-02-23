# companion-module-datavideo-visca

Companion module for controlling Datavideo PTZ cameras via VISCA over DVIP (TCP/IP).

Protocol Spec: http://www.resource.datavideo.com/downloads/Datavideo_PTC-150_DVIP_Protocol.pdf

## Features

### Camera Control

- **Pan/Tilt** — 8 directions with adjustable speed (1-24), home position
- **Zoom** — In/out with adjustable speed (0-7), timed zoom positioning
- **Focus** — Near/far, auto/manual mode, one push trigger
- **Exposure** — Full auto, manual, shutter priority, iris priority, bright mode
- **Iris** — Up/down, direct set from dropdown
- **Shutter** — Up/down, direct set from dropdown
- **Gain** — Up/down/reset
- **White Balance** — Auto, indoor, outdoor, one push, VAR, manual modes
- **Color Temperature** — Direct set (2400K-7100K)
- **Red/Blue Gain** — Up/down/reset for manual white balance fine-tuning
- **Backlight** — On/off compensation
- **Presets** — Save/recall 64 presets with configurable drive speed
- **Tally** — Red, green, off
- **OSD** — Menu navigation (enter, back, up/down/left/right)
- **Custom** — Send arbitrary VISCA hex commands

### Real-Time Feedback

When the status inquiry option is enabled, the module provides live variable updates:

| Variable           | Description                          |
| ------------------ | ------------------------------------ |
| `pt_speed`         | Current pan/tilt speed index         |
| `zoom_speed`       | Current zoom speed index             |
| `zoom_position`    | Current zoom position                |
| `focus_position`   | Current focus position               |
| `focus_mode`       | Auto or Manual                       |
| `power_state`      | Camera power state                   |
| `ae_mode`          | Exposure mode                        |
| `iris_position`    | Current iris position                |
| `shutter_position` | Current shutter position             |
| `gain_position`    | Current gain position                |
| `wb_mode`          | White balance mode                   |
| `color_temp`       | Color temperature (when in VAR mode) |
| `rg_position`      | Red gain position                    |
| `bg_position`      | Blue gain position                   |
| `backlight`        | Backlight compensation state         |
| `pan_position`     | Current pan position                 |
| `tilt_position`    | Current tilt position                |

Variables update in real-time during movements (250ms polling) and immediately on stop commands. Preset recalls trigger a full state refresh over 5 seconds to track camera settling.

### Presets

The module includes preset buttons for all actions, ready to drag onto Companion surfaces. Cycle presets (focus mode, color temperature) display the current value and step through options on each press.

## Development

### Project Structure

```
src/
  main.js        - Module entry point, TCP connection, DVIP framing, inquiries
  actions.js     - All action definitions and callbacks
  constants.js   - Shared choice arrays (iris, shutter, presets, speeds, modes)
  presets.js     - Companion preset button definitions
  variables.js   - Variable definitions
  upgrades.js    - Configuration upgrade scripts
companion/
  manifest.json  - Companion v3 module manifest
  HELP.md        - User-facing help text
tools/
  dvip-mock.js   - Mock DVIP server for testing
```

### Mock DVIP Server

A mock DVIP server is included for testing without camera hardware. It accepts connections, logs decoded VISCA commands, and sends back ACK + Completion responses.

```
yarn mock
```

Point Companion at `127.0.0.1:5002` to test.

### Scripts

| Command        | Description                         |
| -------------- | ----------------------------------- |
| `yarn mock`    | Start mock DVIP server on port 5002 |
| `yarn lint`    | Run ESLint                          |
| `yarn format`  | Format code with Prettier           |
| `yarn package` | Build distributable package         |
