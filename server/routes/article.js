// tips: 这里的处理暂时都用的回调，后续考虑上async/await
const express = require('express');
const router = express.Router();
const mongo = require('../base/mongo');
const bodyParser = require('body-parser');
// tips:后续再根据contenttype的类型做处理
// create application/json parser
// const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res, next) {
	res.end("Hello");
});
// 文章提交
router.post('/post_article', urlencodedParser, function(request, response, next) {
	console.log(typeof request.body)
	mongo.findOne('article_info', {title: request.body.title}, function (err, res) {
		// 查询数据库中是否已经存在此标题
		if (res) {
			response.json({
				code: 101,
				msg: 'title already exist'
			})
		} else {
			mongo.save('article_info', request.body, function (saveErr, saveRes) {
				console.log(saveErr, saveRes);
				if (saveErr) {
					saveErr.code = 201;
					response.json(saveErr);
				} else {
					saveRes.code = 0;
					response.json(saveRes);
				}
			});
		}
	});
});

router.get('/test', function(req, res, next) {
	res.end("Hello");
});

module.exports = router;
