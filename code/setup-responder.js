const zmq = require('zeromq-stable');

const { messageToJson, objToMessage, makeErrorMessage } = require('./message_to_json');

const setupResponder = (slave, port) => {
	const responder = zmq.socket('rep');
	responder.bind('tcp://*:'+port);
	responder.on('message', (request) => {
		try {
			const msg = messageToJson(request);
			slave(msg).then(response=> {
				console.log(response)
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
}

module.exports = setupResponder;
