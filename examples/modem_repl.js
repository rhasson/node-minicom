var repl = require('repl'),
	Mini = require('../index');

var mc = new Mini(),
	port1 = mc.addPort({
		port: '/dev/ttyACM1',
		phone: '14444447010'
	});
	console.log('Connected on port: ', port1.port, 'with : ', port1.phone);
	port1.modem.on('data', function(data) {
		console.log('Port1 data: ', data);
	});

	port2 = mc.addPort({
                 port: '/dev/ttyACM2',
                 phone: '14444447003'
        });
	console.log('Connected on port: ', port2.port, 'with : ', port2.phone);
        port2.modem.on('data', function(data) {
                console.log('Port2 data: ', data);
		if (data.data.code === 'RING') port2.modem.write('ATA');
        });

	repl.start({prompt: '=>'}).context.ports = {p1: port1, p2:port2}
