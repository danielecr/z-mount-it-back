const setupResponder  = require('./setup-responder.js');

const { mockResponder, mockInspector } = require('./mock-responder.js');

const imposter = (engines) => (msg) => {
    try {
        switch(msg.cmd) {
        case '/add_rep_service':
			return engines.create(msg.data).then(_=>{
				setupResponder(mockResponder(msg.data.port), msg.data.port);
				return 'ok';
			});
        case '/get_calls':
            return mockInspector(msg)
        default:
            return Promise.resolve({error:'unknown request'})
        }
    } catch( err) {
        return Promise.reject(err.toString());
    }
}

module.exports = imposter;
