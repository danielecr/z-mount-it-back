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

const msg_out_sql = {
    error: null,
    data: {
        rows: [{f:1,f2:2}]
    }
}

const unknown_request = {
    error: 'unknown request'
}

const remove_rep = {
    cmd: '/service_rep_del',
    data: {
        port: 4441
    }
}

const setup = {
    cmd: "/service_rep_add",
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
                                { "RegExp": /^SELECT\s+\*\s+FROM tablex.*$/i.toString()}
                            ]
                        }
                    ]
                },
                msg_out: msg_out_sql
            }
        ],
        unknown_request
    }
}

const clear_calls = {
    cmd: '/calls_clear',
    data: {
        port: 4441,
        "JSONPath": "$.[?(@.cmd=='/getMatchingProductByEAN')]"
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
            cmd: '/calls_list',
            data: {
                port: 4441,
                "JSONPath": "$.[?(@.cmd=='/getMatchingProductByEAN')]"
            }
        }
        imposter(askMsg).then(calls=>{
            console.log('calls', calls);
            assert.deepEqual(calls.data[0], msg);
            // calls.data[0] should be equals msg
            imposter(clear_calls).then(reply=> {
                console.log('clear call replied', reply);
            })
        })
    })
    const msgSql = {
        cmd: '/sql',
        data: {
            sql: 'SELECT BLAH'
        }
    }
    mockedService(msgSql).then( response => {
        console.log('mocked service replied to sql', response)
        assert.deepEqual(response, unknown_request)
    })
    const msgSqlPass = {
        cmd: '/sql',
        data: {
            sql: 'SELECT *    FRoM tablex WHERE Blah=23'
        }
    }
    mockedService(msgSqlPass).then( response => {
        console.log('mocked service replied to sql right', response)
        assert.deepEqual(response, msg_out_sql)
    })
}




imposter(setup).then(response=> {
    console.log('Imposter Setted: ',response)
    sendToMock();
})
