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
  sp.on('data', self.dataHandler.bind(this, port));
  sp.on('error', self.errorHandler.bind(this, port));
  return sp;
}

Modem.prototype.dataHandler = function(port, data) {
  var self = this;
  console.log('Modem data: ', data);
  self.emit('data', {data:data, port: port});
}

Modem.prototype.errorHandler = function(port, err) {
  var self = this;
  console.log('Modem error: ', err);
  var e = new Error(port + ' has failed to load: ', err);
  self.emit('error', {error: e, port: port});
}

module.exports = exports = Modem;

exports.list = serialPort.list;
