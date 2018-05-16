const express = require('express');
const router = express.Router();
const mongo = require('../base/mongo');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const jwtDecode = require("express-jwt");
const secretOrPrivateKey = 'tokentest';
// tips:后续再根据contenttype的类型做处理
// create application/json parser
// const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });
// 登录
router.post('/login', urlencodedParser, (request, response, next) => {
    console.log('aa', request.body.id, request.body.psw)
	if (request.body.id && request.body.psw) {
	    console.log('has id&psw')
		mongo.findOne('user_info', {id: request.body.id, psw: request.body.psw}, (err, res) => {
			if (res) {
			    let str = JSON.stringify({
						id: request.body.id,
						psw: request.body.psw
          });
				let token = jwt.sign(str, secretOrPrivateKey);
				response.json({
					code: 0,
					msg: 'success',
          token: token
				})
			} else {

			}
		})
	} else {
		response.json({
			code: 301,
			msg: 'lack of parameters'
		})
	}
});

router.get('/test', (request, response, next) => {
  console.log('in test')
	let token = request.query.token;
	if (token) {
	    console.log(token)
		let decode = verify(token, secretOrPrivateKey);
	    console.log(decode)
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
function verify(token, secretOrPrivateKey) {
	jwt.verify(token, secretOrPrivateKey, (err, decoded) => {
		console.log('in verify')
		console.log(err)
		if (err) {
			return false
		} else {
			console.log('success')
			// 如果验证通过，在req中写入解密结果
			// req.decoded = decoded;
			//console.log(decoded)  ;
			return decoded;
			// next(); //继续下一步路由
		}
	});
}
module.exports = router;
