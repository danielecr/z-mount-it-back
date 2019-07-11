const setupResponder  = require('./setup-responder.js');

const { mockResponder, mockInspector } = require('./mock-responder.js');

const imposter = (engines) => (msg) => {
    try {
        switch(msg.cmd) {
        case '/service_rep_add':
			return engines.create(msg.data).then(_=>{
				setupResponder(mockResponder(msg.data.port), msg.data.port);
				return 'ok';
			});
        case '/calls_list':
        case '/calls_clear':
            return mockInspector(msg)
        default:
            return Promise.resolve({error:'unknown request'})
        }
    } catch( err) {
        return Promise.reject(err.toString());
    }
}

module.exports = imposter;
