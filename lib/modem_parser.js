modemParser = function() {
  var res = require('./codes.js').respons_codes;
  var cmd = require('./codes.js').cmd;
  
  return function(emitter, buf) {
    var data = buf.toString();
    var res = {};

    switch(data) {
    	case 'ERROR':
    		res.type = 'error';
    		res.buf = data;
    }
    emitter('data', data);
  }
}

module.exports = exports = modemParser;