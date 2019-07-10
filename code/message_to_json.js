
const messageToJson = (request) => {
    try {
        return JSON.parse(request.toString());
    } catch (err) {
        return { error: {msg: 'error while parsing', detail: err.toString}}
    }
}

const objToMessage = (obj) => JSON.stringify(obj);

const makeErrorMessage = (message) => {
    let obj = {error: message};
    return objToMessage(obj)
}

module.exports = { messageToJson, objToMessage, makeErrorMessage };
