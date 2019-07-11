const {JSONPath} = require('jsonpath-plus');

const engines = {};

const create = (def) => {
	if ( engines[def.port]) {
		return Promise.reject('already exists');
	} else {
		engines[def.port] = { definition: def, calls: {} }
		console.log('engines', engines);
		return Promise.resolve(def.port);
	}
}

const addCall = (port, message) => {
	if (engines[port].calls[message.cmd]) {
		engines[port].calls[message.cmd].push(message);
	} else {
		engines[port].calls[message.cmd] = [message];
	}
}

const matchingCmd = (requests, cmd) => {
	return requests.filter(def=>def.msg_in.cmd==cmd);
}

const dataPassTests = (data, tests, test_mode = 'all') => {
	const passed_tests = tests.filter(test => {
		if (test.type) {
			if (test.type === 'Array' && Array.isArray(data)) {
				return true;
			} else {
				console.log('type', test.type, Array.isArray(data))
			}
			if (typeof data === test.type) {
				console.log('it is test type', test.type)
				return true;
			}
			console.log('type test failed', test.type, typeof data, data)
			return false
		}
		if (test.prop) {
			const prop = data[test.prop];
			switch(test.comp) {
				case 'gt':
				return prop > test.term?test.term:0;
				default:
				return false;
			}
		}
		if (test.type_each) {
			const agree = data.filter(each => {
				return typeof each === test.type_each
			})
			return agree.length === data.length
		}
	})
	console.log('passedtests', passed_tests);
	if(test_mode === 'some') {
		return passed_tests.length>0;
	}
	if(test_mode === 'none') {
		return passed_tests.length===0;
	}
	if(test_mode === 'all') {
		return passed_tests.length === tests.length
	}
}

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
	const definition = engines[port].definition;
	addCall(port, message);
	const requestsCmd = matchingCmd(definition.requests, message.cmd);
	console.log('request cmd', requestsCmd)
	const requestsData = matchingData(requestsCmd, message.data);
	console.log('matched reqs', requestsData)
	if(requestsData.length) {
		return requestsData[0].msg_out
	}

}


module.exports = {
	create,
	getMatchingResponse
}
