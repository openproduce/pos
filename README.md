pos
===

This is a retail point of sale system for a [small grocery
store](http://www.openproduce.org/).

## client

The `client` directory contains a keyboard-driven cash register UI designed to
run full screen in a web browser. It supports USB magstripe readers and barcode
scanners that act like keyboards. It contains very little business logic and no
database logic. Instead it exchanges messages using a REST JSON protocol with a
colocated server program.

## server

The `server` directory contains a Python server that runs on each cash
register. It exchanges messages using a REST JSON protocol with a locally
running UI client. Its main jobs are to talk to a database server and handle
unsupported browser peripherals like receipt printers.