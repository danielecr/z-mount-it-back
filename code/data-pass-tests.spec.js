
const dataPassTests = require('./data-pass-tests');

const data = 'SELECT * from tablex';
const tests = [
	{ "RegExp": /^SELECT\s+\*\s+FROM tablex.*$/i.toString()}
]
const pass = dataPassTests(data, tests, 'all')

console.log('pass', pass)
