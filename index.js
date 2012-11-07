var Modem = require('./lib/modem'),
    fs = require('fs');

/*
* Constructor for Minicom
* input is a config object with defaults and array of ports
* defaults = {echo: true/false, dial_timeout: # in sec}
* ports = [ {port: /dev/ttyACM0, phone: 1234443322, type: some string, config: {auto_answer: true/false} } ]
*/
var Minicom = function(arg) {
  this.activePorts = {};
  this.detectedPorts = {};
  this.config = {};

  if (!(this instanceof Minicom)) return new Error('Must be initialized before being used');

  var self = this;
  var keys = arg ? Object.keys(arg) : [];
  if (keys.length) {
    if (keys.indexOf('defaults') !== -1) this.config.defaults = args.defaults;
    if (keys.indexOf('ports') !== -1) this.config.ports = args.ports;
    self.initPorts();
  } else {
    this.loadConfig('config.json', function(err) {
      if (!err) self.initPorts();
      else return self;
    });
  }
}

Minicom.prototype.initPorts = function() {
  var self = this;
  if (self.config && self.config.ports.length) {
    self.config.ports.forEach(function(port) {
      self.addPort(port);  //TODO: check for failed port setup
    });
  }
}

Minicom.prototype.loadConfig = function(file, cb) {
  var self = this;
  fs.readFile(__dirname + '/' + file, function(err, data) {
    if (!err) {
      self.config = JSON.parse(data);
      return cb(null);
    } else return cb(err);
  });
}

Minicom.prototype.addPort = function(ports, success_cb, error_cb) {
  var self = this,
      keys = Object.keys(self.activePorts),
      port = ports.port;

  success = (typeof success_cb === 'function') ? success_cb : self.defaultSuccessHandler;
  error = (typeof error_cb === 'function') ? error_cb : self.defaultErrorHandler;

  if (keys.indexOf(port) < 0) {
    sp = new Modem(port);
    if (sp) {
      sp.on('error', error);
      sp.on('data', success);
      self.activePorts[port] = {
        modem: sp,
        phone: ports.phone
      }
      return self.activePorts[port];
    }
    else {
      console.log('Failed to setup port: ',port);
      return new Error('Failed to setup port: ', port);
    }
  }
  return self.activePorts[port];
}

Minicom.prototype.defaultSuccessHandler = function(obj) {
  console.log('Index default success handler: ', obj.data);
}

Minicom.prototype.defaultErrorHandler = function(obj) {
  var self = this,
      errorPorts = [];

  console.log('Index default error handler: ', obj.error);

  errorPorts.push(obj.port);
}

Minicom.prototype.list = Modem.list;

exports = module.exports = Minicom;
//exports = module.exports = list = require('./lib/modem').list;
