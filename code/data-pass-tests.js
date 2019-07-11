
const regExpFromString = (inputstring) => {
	const [all, pattern, flags] = inputstring.match(new RegExp('^/(.*?)/([gimyu]*)$'));
	//console.log('found pattern, flags', all, pattern, flags)
	return new RegExp(pattern, flags);
}

const dataPassTests = (data, tests, test_mode = 'all') => {
	const passed_tests = tests.filter(test => {
		if (test.type) {
			if (test.type === 'Array' && Array.isArray(data)) {
				return true;
			}
			if (typeof data === test.type) {
				//console.log('it is test type', test.type)
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
		if (test.RegExp) {
			const exp = regExpFromString(test.RegExp)
			return exp.test(data)
		}
	})
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

module.exports = dataPassTests
