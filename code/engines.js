const {JSONPath} = require('jsonpath-plus');

const engines = {};

const create = (def) => {
	if ( engines[def.port]) {
		return Promise.reject('already exists');
	} else {
		engines[def.port] = { definition: def, calls: [] }
		console.log('engines', engines);
		return Promise.resolve(def.port);
	}
}

const addCall = (port, message) => {
	engines[port].calls.push(message);
}

const matchingCmd = (requests, cmd) => {
	return requests.filter(def=>def.msg_in.cmd==cmd);
}

const dataPassTests = require('./data-pass-tests');

const matchingData = (requests, data) => {
	return requests.filter(def => {
		const cnt_dmatches = def.msg_in.data_matches.reduce( (acc, datamatch) => {
			const matches = JSONPath( { path: datamatch.JSONPath, json: {data}, wrap: false });
			console.log('jpathmatches', matches, datamatch.JSONPath, {data});
			const pass = dataPassTests(matches, datamatch.tests, datamatch.test_mode?datamatch.test_mode:'all');
			return pass?acc + 1:acc;
		}, 0);
		return cnt_dmatches === def.msg_in.data_matches.length
	});
}

const getMatchingResponse = (port, message) => {
	console.log(port, message)
	engines[port].calls.push(message);
	const definition = engines[port].definition;
	const requestsCmd = matchingCmd(definition.requests, message.cmd);
	console.log('request cmd', requestsCmd)
	const requestsData = matchingData(requestsCmd, message.data);
	console.log('matched reqs', requestsData)
	if(requestsData.length) {
		return requestsData[0].msg_out
	}
	return definition.unknown_request || {error: 'unknown'}
}

const returnCalls = (filters) => {
	const path = filters.JSONPath;
	return JSONPath( { path, json: engines[filters.port].calls, wrap: false});
}

const inspect = (msg) => {
	if(! msg.data.port) {
		return Promise.resolve({error: 'missing port prop in data, for inspect command: ' + msg.cmd})
	}
	switch (msg.cmd) {
		case '/get_calls':
			const callList = returnCalls(msg.data);
			return Promise.resolve({error:null, data: callList})
	}
	return Promise.resolve({error: 'Unknown request' + msg.cmd})
}

module.exports = {
	create,
	getMatchingResponse,
	inspect
}
