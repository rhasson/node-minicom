modemParser = function() {
  var res = require('./codes.js').respons_codes;
  var cmd = require('./codes.js').cmd;
  
  return function(emitter, buf) {
    var data = buf.toString();


    emitter('data', buf);
  }
}

module.exports = exports = modemParser;