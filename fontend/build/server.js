const express = require('express')
const webpack = require('webpack')
const opn = require('opn')
const path = require('path')

const app = express()
const port = 3000

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const proxyMiddleware = require('http-proxy-middleware')
const historyApiFallback = require('connect-history-api-fallback')

const config = require('./webpack.common.conf')('development')
const compiler = webpack(config)

const proxyTable = require('./proxy')

for (let context in proxyTable) {
    app.use(proxyMiddleware(context, proxyTable[context]))
}

app.use(historyApiFallback(require('./historyfallback')))

app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
		stats: {
			colors: true,
			chunks: false
		}
}))

// 路由
app.get('/:viewname?', function(req, res, next) {

	var viewname = req.params.viewname
		? req.params.viewname + '.html'
		: 'index.html';

	var filepath = path.join(compiler.outputPath, viewname);

	// 使用webpack提供的outputFileSystem
	compiler.outputFileSystem.readFile(filepath, function(err, result) {
		if (err) {
			// something error
			return next(err);
		}
		res.set('content-type', 'text/html');
		res.send(result);
		res.end();
	});
});

app.use(webpackHotMiddleware(compiler))

app.listen(port, function () {
    console.log('success listen to ' + port)
    opn('http://localhost:' + port)
})