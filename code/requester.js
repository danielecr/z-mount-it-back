
const zmq = require('zeromq-stable');

const { messageToJson, objToMessage, makeErrorMessage } = require('./message_to_json');

// target = 'tcp://localhost:5553'
const requer = (target) => (obj) => new Promise( (resolve, reject) =>  {
    let requester = zmq.socket('req');
    requester.on("message", (reply) => {
        //console.log(reply, 'received reply', x, JSON.parse(reply.toString()));
        requester.close()
        resolve(messageToJson(reply));
    });
    requester.on('error', (err) => {
        requester.close()
        reject(err.toString());
    })
    requester.connect(target);
    requester.send(objToMessage(obj));
})

module.exports = requer;
