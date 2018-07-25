var http = require('http');
var express = require('express');
var app = express();
var router = require('./routes/routing');
var cors = require('cors');
var bodyParser = require('body-parser');

//app.use(router);

/*var options = {

}
http.createServer(options, app).listen(3500);*/

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json({
    limit: '10mb'
}))

app.use('*', function (req, res, callback) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    callback();
})

app.use("/api/v1.0", router);

app.listen(3501);

console.log("Server ready to listen requests on port 3501: http:/localhost:3501/");