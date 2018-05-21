const express = require('express');
// morgan 日志中间件
const morgan = require("morgan");
const fs = require('fs');
const path = require('path');
// 日志文件自动转换
const rfs = require('rotating-file-stream');
const http = require('http');
const app = express();
const articleRouter = require('./routes/article');
const userRouter = require('./routes/user');
const jwtDecode = require("express-jwt");

/* 日志 */
const logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
function pad(num) {
	return (num > 9 ? "" : "0") + num;
}
function generator(time, index) {
	if(! time)
		return "file.log";

	let month  = time.getFullYear() + "" + pad(time.getMonth() + 1);
	let day    = pad(time.getDate())
	let hour   = pad(time.getHours())
	let minute = pad(time.getMinutes())

	return month + "/" + month + day  + "-file.log"
}
// create a rotating write stream
let accessLogStream = rfs(generator(new Date()), {
	interval: '1d', // rotate daily
	path: logDirectory
})
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));


//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1')
	// res.header("Content-Type", "application/json;charset=utf-8");
	next();
});
/* 静态文件处理 */
// 所有的请求通过这个中间件，如果没有文件被找到的话会继续前进
let publicPath = path.resolve(__dirname, "../fontend/dist");
app.use(express.static(publicPath));

// app.use(jwtDecode({
// 	secret: 'tokentest'
// }).unless({
// 	path: ['/user/login']  //除了这个地址，其他的URL都需要验证
// }));
// 模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// 路由
// 当请求/test的时候被调用
app.get('/test/:who', function(request, response) {
	response.end("Hello, " + request.params.who + ".");
});
app.use('/article', articleRouter);
app.use('/user', userRouter);


// 前面都不匹配，则路由错误。返回 404 页面
// app.use(function(request, response) {
// 	response.statusCode = 404;
// 	response.end("404, not found");
// });
app.use(function(req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// error handler
app.use(function(err, req, res, next) {
	console.log('------------------');
	if (err.name === 'UnauthorizedError') {
		//  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
		// res.status(401).send('invalid token...');
		res.json({
			code: 500,
			msg: 'invalid token'
		});
		return;
	}
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	// 使用静态文件
	res.sendFile(path.join(__dirname, 'views/notfound.html'))
	// 使用jade模板
	// res.render('error');
});

http.createServer(app).listen(80)