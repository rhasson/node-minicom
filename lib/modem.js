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
  if (data.code) {
    if (data.data.indexOf(this.cmd) === -1) data.data.unshift(this.cmd);
    self.emit('data', {data:data, port: port});
  }
}

Modem.prototype.errorHandler = function(port, err) {
  var self = this;
  console.log('Modem error: ', err);
  var e = new Error(port + ' has failed to load: ', err);
  self.emit('error', {error: e, port: port});
}

Modem.prototype.init = function(initStr) {
  var i = this.formatInit(initStr);
	console.log('Init string: ', i);
  this.writeRaw(i);
}

Modem.prototype.writeRaw = function(buf) {
  this.cmd = (typeof buf === 'string') ? buf : (buf === undefined) ? '' : buf.toString();
  if (Buffer.isBuffer(buf)) this.sp.write(buf);
  else if (typeof buf === 'string') {
    if (buf.indexOf('\r\n') < 0) buf += '\r\n';
    this.sp.write(buf);
  }
}

Modem.prototype.placeCall = function(to) {
  if (typeof to === 'string') return this.writeRaw('ATDT'+to);
  else {
    this.sp.pipe(to.modem.sp);
  }
}

Modem.prototype.formatInit = function(init) {
  var str = 'AT';
  var c = cmd.INIT;

  if (typeof init === 'string') str += init;
  else {
     init = init || {}; 
    util._extend(c, init);
    for (x in c) {
      if (x.match(/^S/)) {
        str += x + "=" + c[x] + " ";
      } else {
        str += x + c[x] + " ";
      } 
    }
  }
  str.trim();
  str += "\r\n";
  return str;
}

module.exports = exports = Modem;

exports.list = serialPort.list;
