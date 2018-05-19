const express = require('express');
const router = express.Router();
const mongo = require('../base/mongo');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const jwtDecode = require("express-jwt");
const secretOrPrivateKey = 'tokentest';
const main = require("../base/main");
// tips:后续再根据contenttype的类型做处理
// create application/json parser
// const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({extended: false});
// 登录
router.post('/login', urlencodedParser, (request, response, next) => {
	// 保证有id和密码
	if (request.body.id && request.body.psw) {
		console.log('has id&psw')
		// 验证账号密码是否正确
		mongo.findOne('user_info', {id: request.body.id, psw: request.body.psw}, (err, res) => {
			// 账号密码正确
			if (res) {
				// 将历史token全部标记为不可用
                mongo.update('token_info',{id: request.body.id}, {can_use: false}, function (saveErr, saveRes) {
                	// 保存此次tokeninfo
                    mongo.save('token_info', {id: request.body.id, can_use: true}, function (saveErr, saveRes) {
                        if (saveErr) {
                            saveErr.code = 201;
                            response.json(saveErr);
                        } else {
                            console.log('id', saveRes._id)
                            // 生成一个token
                            let now = new Date().getTime();
                            let str = JSON.stringify({
                                id: request.body.id,
                                psw: request.body.psw,
                                expires: now + 7200000,
                                refresh: now + 1800000,
                                token_id: saveRes._id
                            });
                            let token = jwt.sign(str, secretOrPrivateKey);
                            response.json({
                                code: 0,
                                msg: 'success',
                                token: token
                            });
                        }
                    });
                });
			} else {
				response.json({
					code: 0,
					msg: 'error id or password'
				});
			}
		})
	} else {
		response.json({
			code: 301,
			msg: 'lack of parameters'
		})
	}
});
// 验证token是否可用
router.get('/auth', async (request, response, next) => {
	console.log('in auth')
	let token = request.query.token;
	if (token) {
		console.log(token)
		let decode = await main.verify(token);
		console.log('decode', decode)
		if (decode) {
			response.json({
				code: 0,
				msg: 'valid token'
			});
		} else {
			response.json({
				code: 5555,
				msg: 'invalid token'
			})
		}
	}
});

// 注销
router.get('/logout', async (request, response, next) => {
	console.log('in logout')
	let token = request.query.token;
	if (token) {
		console.log(token)
		let decode = await main.verify(token);
		if (decode) {
			// 走注销流程
			mongo.update('token_info',{_id: decode.token_id}, {can_use: false}, function (saveErr, saveRes) {
				if (saveErr) {
					saveErr.code = 201;
					response.json(saveErr);
				} else {
					response.json({
						code: 0,
						msg: 'success'
					});
				}
			});
		} else {
			response.json({
				code: 5555,
				msg: 'invalid token'
			})
		}
	}
});

router.get('/test', (request, response, next) => {
	console.log('in test')
	let token = request.query.token;
	if (token) {
		console.log(token)
		let decode = main.verify(token);
		console.log('success2', decode)
		response.json({
			code: 0,
			data: decode
		})
	}
});

// 注册
router.post('/register', urlencodedParser, (request, response, next) => {
	if (request.body.id && request.body.psw) {
		mongo.findOne('user_info', {id: request.body.id}, (err, res) => {
			if (res) {
				response.json({
					code: 101,
					msg: 'id already exist'
				})
			} else {
				mongo.save('user_info', request.body, function (saveErr, saveRes) {
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
		})
	} else {
		response.json({
			code: 301,
			msg: 'lack of parameters'
		})
	}
});

module.exports = router;
