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
					return resolve(false);
				} else {
					console.log('success', decoded)
					let now = new Date().getTime();
					console.log('now')
					// 超出时间，返回false
					if (now > decoded.expires || !decoded.canUse) {
						console.log('超时');
						return resolve(false);
					}
					mongo.findOne('user_info', {id: decoded.id, psw: decoded.psw}, (err, res) => {
						if (res) {
							// 查询到
							console.log('账号密码正确');
							return resolve(true);
						} else {
							// 未查询到
							console.log('账号密码错误')
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