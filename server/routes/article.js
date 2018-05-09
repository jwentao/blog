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
router.get('/get_article_list', (request, response, next) => {
	console.log(request.query)
	// 分页数据，默认每页10个，从0开始
	let num = parseInt(request.query.num) ? parseInt(request.query.num) : 10;
	let idx = parseInt(request.query.idx) ? parseInt(request.query.idx) * num : 0;
	let conditions = {};
	// 返回除开原文和转换后文章的所有字段
	let fields = {
		origin_article: 0,
		trans_article: 0
	};
	let option = {
		limit: num,
	  skip: idx
	};
	console.log(option)
	mongo.find('article_info', conditions, fields, option, function (err, res) {
		if (err) {
			response.json({
				msg: 'error',
				code: 201
			})
		} else {
			response.json({
				msg: 'success',
				code: 0,
				data: res.data,
				total: res.total
			})
		}
	})
})
router.get('/get_article_detail', (request, response) => {
	console.log(request.query.id)
	let id = request.query.id;
    mongo.findById('article_info', id, (err, res) => {
        if (err) {
            response.json({
                msg: 'error',
                code: 201
            })
        } else {
        	console.log(res)
            response.json({
                msg: 'success',
                code: 0,
                data: res
            })
        }
    })
})
// 文章提交
router.post('/post_article', urlencodedParser, function(request, response, next) {
	for (let i in request.body) {
		console.log(i + '---')
	}
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
					response.json({
						code: 0,
						msg: 'success',
						data: saveRes
					});
				}
			});
		}
	});
});

router.get('/test', function(req, res, next) {
	res.end("Hello");
});

module.exports = router;
