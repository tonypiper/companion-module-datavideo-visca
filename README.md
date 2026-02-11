# companion-module-datavideo-visca

See HELP.md and LICENSE

Protocol Spec: http://www.resource.datavideo.com/downloads/Datavideo_PTC-150_DVIP_Protocol.pdf

## Development

### Mock DVIP Server

A mock DVIP server is included for testing without camera hardware. It accepts connections, logs decoded VISCA commands, and sends back ACK + Completion responses.

```
yarn mock
```

Point Companion at `127.0.0.1:5002` to test. The server hot-reloads on file changes.
