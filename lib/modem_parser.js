var res_codes = require('./codes.js').response_codes,
    cmd = require('./codes.js').cmd;

modemParser = function() {
  var tmp = [];
  var parse = function(str) {
    var rn = /[\r\n]+/;
    var fp, np, res = {};

    fp = str.match(rn);
    if (fp) {
      if (fp.index === 0) {
        str = str.substr(fp[0].length);  //marker at beginning
        return parse(str);
      }
      if (fp.index > 0) {  //marker in middle or at end
        tmp.push(str.substring(0, fp.index)); //save text
        str = str.substr(fp.index + fp[0].length);  //shift sentence past marker
        if (str.length > 0) return parse(str);
      } 
    } 
    if (tmp.length) {
      res.data = [];
      tmp.forEach(function(v, i) {
        if (res_codes.indexOf(v) !== -1) {
          res.code = v.trim();
          tmp.splice(i+1);
        } else {
          res.data.push(v.trim());
        }
      });
      tmp = [];
    } else {
      res.data = str;
      res.code = '';
      tmp = [];
    }
    return res;
  }

  return function(emitter, buf) {
    var ret;
    var data = buf.toString();

    ret = parse(data);

    emitter.emit('data', ret);
  }
}

module.exports = exports = modemParser();
