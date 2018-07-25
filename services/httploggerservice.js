function returnResponse(rec, msg) {
    var result = {
        IsError: false,
        Message: msg,
        Output: rec
    };
    return result;
}

function returnError(err, msg) {
    var result = {
        IsError: true,
        Error: (err && err.Message) ? err.Message : err,
        Message: msg,
    };
    return result;
}

function returnInfo(typ, msg) {
    var result = {
        IsError: true,
        Error: typ,
        Message: msg,
    };
    return result;
}

module.exports.returnResponse = returnResponse;
module.exports.returnError = returnError;
module.exports.returnInfo = returnInfo;