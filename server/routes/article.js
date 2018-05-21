// tips: 这里的处理暂时都用的回调，后续考虑上async/await
const express = require('express');
const router = express.Router();
const mongo = require('../base/mongo');
const bodyParser = require('body-parser');
const main = require("../base/main");
// tips:后续再根据contenttype的类型做处理
// create application/json parser
// const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res, next) {
	res.end("Hello");
});
/**
 * 获取文章列表
 * @param num 每页返回的文章数量，默认为10
 * @param idx 分页，从0开始，默认为0
 */
router.get('/get_article_list', (request, response, next) => {
	console.log(request.query)
	// 分页数据，默认每页10个，从0开始
	let num = parseInt(request.query.num) ? parseInt(request.query.num) : 10;
	let idx = parseInt(request.query.idx) ? parseInt(request.query.idx) * num : 0;
	let conditions = {};
	if (request.query.type === '1' || request.query.type === '2') {
		conditions.type = request.query.type;
	}
	// 返回除开原文和转换后文章的所有字段
	let fields = {
		origin_article: 0,
		trans_article: 0
	};
	let option = {
		limit: num,
	  skip: idx
	};
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
});
/**
 * 获取文章详情
 * @param id 文章id
 */
router.get('/get_article_detail', (request, response) => {
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
});
/**
 * 提交文章
 * @param title 文章标题
 *
 */
router.post('/post_article', urlencodedParser, async function(request, response, next) {
	// token取出来用于验证，之后就可以删掉
	let token = request.body.token;
	delete request.body.token;
	if (token) {
		console.log(token)
		let decode = await main.verify(token);
		console.log('decode', decode)
		if (!decode) {
			response.json({
				code: 6666,
				msg: 'invalid token'
			});
			return;
		}
	} else {
		response.json({
			code: 5555,
			msg: 'no token'
		});
		return;
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
/**
 * 更新文章
 * @param title 文章标题
 *
 */
router.post('/update_article', urlencodedParser, async function(request, response, next) {
	// token取出来用于验证，之后就可以删掉
	let token = request.body.token;
	delete request.body.token;
	if (token) {
		console.log(token);
		let decode = await main.verify(token);
		console.log('decode', decode)
		if (!decode) {
			response.json({
				code: 6666,
				msg: 'invalid token'
			});
			return;
		}
	} else {
		response.json({
			code: 5555,
			msg: 'no token'
		});
		return;
	}
	mongo.findOne('article_info', {_id: request.body._id}, function (err, res) {
		// 查询数据库中是否已经存
		if (res) {
            mongo.update('article_info',{_id: request.body._id}, request.body, function (saveErr, saveRes) {
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
		} else {
            response.json({
                code: 1111,
                msg: 'id not exit'
            });
		}
	});
});
/**
 * 删除文章
 * @param
 *
 */
router.get('/delete_article', async (request, response, next) => {
	// token取出来用于验证，之后就可以删掉
	let token = request.query.token;
	delete request.query.token;
	if (token) {
		console.log(token);
		let decode = await main.verify(token);
		console.log('decode', decode)
		if (!decode) {
			response.json({
				code: 6666,
				msg: 'invalid token'
			});
			return;
		}
	} else {
		response.json({
			code: 5555,
			msg: 'no token'
		});
		return;
	}
    mongo.findOne('article_info', {_id: request.query._id}, function (err, res) {
        // 查询数据库中是否已经存
        if (res) {
            mongo.remove('article_info',{_id: request.query._id}, function (saveErr, saveRes) {
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
        } else {
            response.json({
                code: 1111,
                msg: 'id not exit'
            });
        }
    });
});
/**
 * 根据关键字搜索文章
 * @param id 文章id
 */
router.get('/search_by_title', (request, response, next) => {
	console.log(request.query)
	// 分页数据，默认每页10个，从0开始
	let num = parseInt(request.query.num) ? parseInt(request.query.num) : 10;
	let idx = parseInt(request.query.idx) ? parseInt(request.query.idx) * num : 0;
	let title = request.query.title;
	let conditions = {
		title: new RegExp(title, 'i')
	};
	console.log('conditions', conditions.title)
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
});

router.get('/test', function(req, res, next) {
	res.end("Hello");
});

module.exports = router;
