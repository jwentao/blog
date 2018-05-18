const _config = require('./config');
const jwt = require("jsonwebtoken");
const mongo = require('./mongo');
let verify = function (token) {
    return new Promise((resolve, reject) => {
			jwt.verify(token, _config.secretOrPrivateKey, (err, decoded) => {
				console.log('in verify')
				console.log(err)
				// 解密失败，返回false
				if (err) {
					console.log('解密失败')
					return resolve(false);
				} else {
					console.log('success', decoded)
					let now = new Date().getTime();
					// 超出时间，返回false
					if (now > decoded.expires) {
						console.log('超时');
						return resolve(false);
					}
					mongo.findOne('token_info', {_id: decoded.token_id}, (tokenErr, tokenEes) => {
						if (tokenEes) {
							// 查询到,验证是否可用
							if (tokenEes.can_use) {
								// 可用，验证账号密码
								mongo.findOne('user_info', {id: decoded.id, psw: decoded.psw}, (err, res) => {
									if (res) {
										// 查询到
										console.log('账号密码正确');
										return resolve(decoded);
									} else {
										// 未查询到
										console.log('账号密码错误')
										return resolve(false);
									}
								});
							} else {
								return resolve(false);
							}
						} else {
							// 未查询到
							console.log('未查询到')
							return resolve(false);
						}
					});
					// next(); //继续下一步路由
				}
			});
    });
};

module.exports = {
    verify: verify
}