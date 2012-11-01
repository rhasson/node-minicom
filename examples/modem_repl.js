var repl = require('repl'),
	Mini = require('./index');

var mc = new Mini(),
	port = mc.addPort({
		port: 'COM3',
		phone: '14444443322'
	})