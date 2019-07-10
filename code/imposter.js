const setupResponder  = require('./setup-responder.js');

const { mockResponder } = require('./mock-responder.js');

const imposter = (engines) => (msg) => {
    try {
        switch(msg.cmd) {
        case '/add_rep_service':
        console.log('msg,m sg data', msg, msg.data)
			return engines.create(msg.data).then(_=>{
				setupResponder(mockResponder(msg.data.port), msg.data.port);
				return 'ok';
			});
        default:
            return Promise.resolve({error:'unknown request'})
        }
    } catch( err) {
        return Promise.reject(err.toString());
    }
}

module.exports = imposter;
