var serialPort = require('serialport'),
    Serial = serialPort.SerialPort,
    modemParser = require('./modem_parser'),
    handleState = require('./state_handler').handleState,
	  //ee = require('events').EventEmitter,
    Stream = require('stream'),
    fs = require('fs'),
    util = require('util');

var res_codes = require('./codes').response_codes;
var cmd_codes = require('./codes').cmd;

function Modem(port, opts) {
	Stream.Stream.call(this);

	//ee.call(this);
  this.state = {};
  this.state.initial = null;
  this.state.current = null;
  this.state.previous = null;

  this.activeCmd = null;
  this.activeResp = null;

  this.sp = this.setupPort(port, opts);
}

util.inherits(Modem, Stream);

Modem.prototype.write = function(data) {
  this.emit('data', data);
}

Modem.prototype.end = function(data) {
  if (data) this.write(data);
  this.emit('end');
}

Modem.prototype.close = function() {
  this.writeable = false;
  this.readable = false;
  this.emit('close');
}

Modem.prototype.destroy = function() {
  this.close();
}

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
  this.state.initial = 'CREATED';
  this.writeable = true;
  this.readable = true;
  sp.on('data', self.dataHandler.bind(this, port));
  sp.on('error', self.errorHandler.bind(this, port));
  return sp;
}

Modem.prototype.dataHandler = function(port, data) {
  var self = this,
      ret;
  console.log('Modem data for: ', port, ' is: ', data);
  ret = handleState(self.state, self.activeCmd, data.code, data.data);
  this.activeCmd = null;
/*  if (data.code) {
    if (data.data.indexOf(this.activeCmd) === -1) data.data.unshift(this.activeCmd);
    self.emit('data', {data:data, port: port});
  }
*/
  ret.data.port = port;
  ret.data.state = ret.state.current;
  if (ret.state.current.match(/^(CALL|ANSWER|HANGUP)/i)) self.emit('call', ret.data);
  else self.emit('data', ret.data);
}

Modem.prototype.errorHandler = function(port, err) {
  var self = this;
  console.log('Modem error: ', err);
  var e = new Error(port + ' has failed to load: ', err);
  self.emit('error', {error: e, port: port});
}

Modem.prototype.init = function(initStr) {
  var i = this.formatInit(initStr);
  this.writeRaw(i);
  return this;
}

Modem.prototype.writeRaw = function(buf) {
  this.state.previous = this.state.current;
  this.state.current = 'SENDING';
  if (Buffer.isBuffer(buf)) this.sp.write(buf);
  else if (typeof buf === 'string') {
    buf = this.formatCmd(buf);
    this.activeCmd = buf.substring(0, buf.length-2);
    this.sp.write(buf);
  }
  return this;
}

Modem.prototype.dial = function(dest) {
  var src = this;
  if (typeof dest === 'string') return src.writeRaw('ATDT'+dest);
  else {
    src.writeRaw('ATDT'+dest.phone);
    //dest.modem.pipe(src);
  }
  return this;
}

Modem.prototype.formatInit = function(init) {
  var str = '';
  var c = cmd_codes.INIT;

  if (typeof init === 'string') str = this.formatCmd(init);
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
  return str;
}

Modem.prototype.formatCmd = function(str) {
  var ret = str,
      beg = 'AT',
      end = '\r\n';

  str = str.trim();
  if (!str.match(/^AT/)) ret = beg + ret;
  if (!str.match(/[\r\n]+$/)) ret = ret + end;

  return ret;
}

module.exports = exports = Modem;

exports.list = serialPort.list;
