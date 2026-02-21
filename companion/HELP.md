# companion-module-datavideo-visca

This module can be used to control PTZ camera's with the Datavideo DVIP (VISCA over IP with packet length) protocol.

Default TCP port is 5002

## Commands

- Custom Command
  Send a custom VISCA command without the address byte (it is added automatically). For example:
  01 04 00 02 FF
