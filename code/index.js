const imposter_port = process.env.PORT || 5553;

const engine = require('./engines');

const { messageToJson, objToMessage, makeErrorMessage } = require('./message_to_json');

const { setupResponder }  = require('./setup-responder.js');

const imposter = require('./imposter.js')(engine);

setupResponder(imposter, imposter_port);
console.log('responder ... setted')
