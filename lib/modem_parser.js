var res = require('./codes.js').respons_codes,
    cmd = require('./codes.js').cmd,
    ret_codes = ['OK', 'ERROR', 'BUSY', 'NO CARRIER', 'CONNECT'],
    res = {},
    flag = false;

modemParser = function() {
  var parse = function(str) {
    /*var s = str.split(/[\r\n]+/g);
    s.pop();
    s.shift();*/

    var rn = /[\r\n]+/;
    var fp, np, len=0, first_position=0, next_position=0;

    if (!flag) {
      res.data = [];
      res.code = '';
      flag = true;
    }

    fp = str.match(rn);
console.log('FP: ', fp);
    if (fp) {
      len = fp[0].length;
      if (len === 2) {
        str = str.substr(fp.index + len);
console.log('INSIDE FP: ', str);
	if (str) return parse(str);
      }
      first_position = fp.index;
      str = str.substr(first_position + len);
      if (!str) str = str.substring(0, first_position);
console.log('STR: ', str);
      
      np = str.match(rn);
console.log('NP: ', np);
      if (np) {
        len = np[0].length;
        if (len === 2) {
          str = str.substr(np.index + len);
console.log('INSIDE NP: ', str);
          return parse(str);
        }
        next_position = np.index;
        tmp = str.substring(0, next_position);
console.log('TMP: ', tmp);
        if (ret_codes.indexOf(tmp) !== -1) res.code = tmp;
        else res.data.push(tmp);
        str = str.substr(next_position + len)
console.log('STR: ', str);
        if (str.length > 0) return parse(str);
        else {
          flag = false;
          return res;
        }
      } else {
        flag = false;
        res.data.push(str);
        return res;
      }
    } else if(flag && res.data.length) {
console.log('RES: ', res);
      flag = false;
      return res;
    } else if (str.length > 0) {
      flag = false;
      res.data.push(str);
conosle.log('RES2: ', res);
      return res;
    } else return null;
  }

  return function(emitter, buf) {
    var ret;
    var data = buf.toString();

    ret = parse(data);

    console.log('Parser data: ', ret);
    emitter.emit('data', ret);
  }
}

module.exports = exports = modemParser();
