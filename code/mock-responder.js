const engines = require('./engines.js');

const mockResponder = (port) => (msg) => {
	let response = engines.getMatchingResponse(port, msg);
	return Promise.resolve(response);
}

module.exports = {
	mockResponder
}
