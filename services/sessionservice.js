var dbutil = require('../dalayer/dbutil')

function SaveSession(req, callback) {
    var dbobj = dbutil.connect();


    dbobj.SESSION_INFO.insert({
        UserId: req.Id,
        Token: req.token,
        UpdatedDateTime: new Date(),
        IsActive: true
    }, callback)
}

function validateSession(req, callback) {
    var dbobj = dbutil.connect();
    var token = req.headers.token;
    dbobj.SESSION_INFO.findOne({
        Token: token, IsActive: true
    }, { UpdatedDateTime: 1 },
        function (err, res) {
            if (err) {
                callback(err, null);
            } else if (res) {
                var currentDate = new Date();
                var lastDate = new Date(res.UpdatedDateTime);

                if (Math.ceil((currentDate.getTime() - lastDate.getTime()) / 60000) > 20)
                    callback({ err: true, message: "Time Out" }, null);
                else {
                    dbobj.SESSION_INFO.update(
                        {
                            Token: token, IsActive: true
                        },
                        { $set: { UpdatedDateTime: new Date() } }
                        , callback);
                }
            } else {
                callback({ err: true, message: "Invalid Token" }, null);
            }
        }
    );

}

module.exports.SaveSession = SaveSession;
module.exports.validateSession = validateSession;