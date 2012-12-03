var res_codes = require('./codes.js').response_codes,
    cmd = require('./codes.js').cmd;

modemParser = function() {
  var parse = function(str) {
    var rn = /[\r\n]+/g,
        sp = /[\s]/g,
        ex = new RegExp('('+res_codes.join('|')+')', 'g'),
        tmp,
        res = {
          code: null,
          data: []
        };

    //check if any of the code words are in the string
    if (str.match(ex)) {
      //split on \r\n if available
      if (str.match(rn)) tmp = str.split(rn);
      //otherwise split on \s
      else tmp = str.split(sp);
 
      tmp.forEach(function(v, i, a) {
        if (v.match(ex)) res.code = v;
        else if (v.length > 0) res.data.push(v);
      });
    } else res.data.push(str);
    return res;
  }

  return function(emitter, buf) {
    var ret;
    var data = buf.toString();
console.log('PARSER: ', {str: data});
    ret = parse(data);

    emitter.emit('data', ret);
  }
}

module.exports = exports = modemParser();

/*    var rn = /[\r\n]+/;
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
  */
