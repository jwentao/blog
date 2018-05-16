const _config = require('./config');
const jwt = require("jsonwebtoken");
let verify = function (token) {
    return jwt.verify(token, _config.secretOrPrivateKey, (err, decoded) => {
        console.log('in verify')
        console.log(err)
        if (err) {
            return false;
        } else {
            console.log('success', decoded)
            // 如果验证通过，在req中写入解密结果
            // req.decoded = decoded;
            //console.log(decoded)  ;
            return (decoded);
            // next(); //继续下一步路由
        }
    });
};

module.exports = {
    verify: verify
}