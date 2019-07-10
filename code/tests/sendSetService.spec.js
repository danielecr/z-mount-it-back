const assert = require('assert').strict;

const requester = require('../requester')

const imposterAddr = 'tcp://localhost:5553'
const imposter = requester(imposterAddr);

const mockedServiceAddr = 'tcp://localhost:4441';
const mockedService = requester(mockedServiceAddr);

const msg_out = {
    error: null,
    data: {
        values: 123,
        content: "hello"
    }
}

const setup = {
    cmd: "/add_rep_service",
    data: {
        port: 4441,
        requests: [
            {
                "msg_in": {
                    cmd: '/getMatchingProductByEAN',
                    data_matches: [
                        {
                            "JSONPath": "$.data.sellerId",
                            "tests": [
                                { "type": "string" }
                            ]
                        },
                        {
                            "JSONPath": "$.data.eans.*",
                            "tests": [
                                { "type": "Array" },
                                { "prop": "length", "comp": "gt", "term": 1 },
                                { "type_each": "number" }
                            ]
                        }
                    ]
                },
                msg_out
            },
            {
                "msg_in": {
                    cmd: '/sql',
                    data_matches: [
                        {
                            "JSONPath": "$.data.sql",
                            "tests": [
                                { "type": "string" },
                                { "RegExp": /^SELECT\s+\*\s+FROM tablex.*/}
                            ]
                        }
                    ]
                },
                "msg_out": {
                    error: null,
                    data: {
                        rows: [{f:1,f2:2}]
                    }
                }
            }
        ]
    }
}


const sendToMock = () => {
    const msg = {
        cmd: '/getMatchingProductByEAN',
        data: {
            sellerId: "123ciao",
            eans: [ 123, 3123, 41232, 41231]
        }
    }
    mockedService(msg).then(response=>{
        console.log('mockedservice replied', response);
        assert.deepEqual(response, msg_out)
        const askMsg = {
            cmd: '/get_calls',
            data: {
                cmd: '/getMatchingProductByEAN'
            }
        }
        imposter(askMsg).then(calls=>{
            console.log('calls', calls);
            // calls[0] should be equals msg
        })
    })
}




imposter(setup).then(response=> {
    console.log('Imposter Setted: ',response)
    sendToMock();
})
