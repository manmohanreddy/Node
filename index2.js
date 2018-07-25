var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('This is my first node js application.');
}).listen(3500);

console.log("Server ready to listen requests on port 3500: http:/localhost:3500/");