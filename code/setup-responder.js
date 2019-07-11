const zmq = require('zeromq-stable');

const { messageToJson, objToMessage, makeErrorMessage } = require('./message_to_json');

const responders = {};

const setupResponder = (slave, port) => {
	const responder = zmq.socket('rep');
	responder.bind('tcp://*:'+port);
	responder.on('message', (request) => {
		try {
			const msg = messageToJson(request);
			slave(msg).then(response=> {
				responder.send(objToMessage(response));
			}).catch( err => {
				const response = {error:err}
				console.log(response)
				responder.send(objToMessage(response));
			})
		} catch(err) {
			const response = {error:err}
			console.log('last catch', response)
			responder.send(objToMessage(response));
		}
	});
	responders[port] = responder;
}

const disposeResponder = (port) => {
	responders[port].close();
	delete responders[port];
}

module.exports = {
	setupResponder,
	disposeResponder
};
