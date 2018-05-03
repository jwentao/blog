const http = require('http')

function callback(req, res) {
	console.log("In comes a request to: " + req.url)
	res.end("Hello, world!")
}

let server = http.createServer(callback)
server.listen(3000)