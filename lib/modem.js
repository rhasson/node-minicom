var serialPort = require('serialport'),
    Serial = serialPort.SerialPort,
    modemParser = require('./modem_parser'),
	  ee = require('events').EventEmitter;
    fs = require('fs'),
    util = require('util');

var res_codes = require('./codes').response_codes;
var cmd = require('./codes').cmd;

function Modem(port, opts) {
	this.sp = this.setupPort(port, opts);

	ee.call(this);
}

util.inherits(Modem, ee);

Modem.prototype.setupPort = function(port, opts) {
  var self = this;
  opts = opts ? opts : {};
  var sp = new Serial (port, {
    baudrate: opts.baudrate || 9600,
    databits: opts.databits || 8,
    stopbits: opts.stopbits || 1,
    parity: opts.parity || 'none',
    parser: modemParser
  });
  sp.on('data', self.dataHandler.bind(this));
  sp.on('error', self.errorHandler.bind(this, port));
  return sp;
}

Modem.prototype.dataHandler = function(data) {
  var self = this;
  console.log('Modem data: ', data);
  self.emit('data', data);
}

Modem.prototype.errorHandler = function(err, port) {
  var self = this;
  console.log('Modem error: ', err);
  var e = new Error(port + 'has failed to load: ', err);
  self.emit('error', e);
}

module.exports = exports = Modem;

module.exports = exports = list = function(cb) {
  serialPort.list(function(ports) {
  	cb(ports);
  });
}