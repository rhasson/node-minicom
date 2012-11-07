var repl = require('repl'),
	Mini = require('./index');

var mc = new Mini(),
	port = mc.addPort({
		port: '/dev/ttyACM1',
		phone: '14444443322'
	});

	port.modem.on('data', function(data) {
		console.log('Repl data: ', data);
	});

	repl.start({prompt: '=>'});