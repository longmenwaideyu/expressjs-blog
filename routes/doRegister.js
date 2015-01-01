var express = require('express');
var router = express.Router();
var User = require('../models/user');
var salt = 'ILoveXiaoMei';
var util = require('../common/util');
function fail(res, data) {
    res.render('doRegister', { title: '注册-博客', active: 'register', info: data, succ: false, fr: '/register' });
}
router.get('/', function(req, res) {
    var val = req.query;
    val.userID = val.userID.trim();
    val.nick = val.nick.trim();
    val.email = val.email.trim();
    var fr = val.fr;
    delete val.repeat;
    delete val.fr;
    if (!val.userID || !val.password || !val.email) {
        var data = '';
        if (!val.userID) data = '用户名不能为空';
        if (!val.password) data = '密码不能为空';
        if (!val.email) data = '邮箱不能为空';
        fail(res, data);
        return;
    }
    var reg = /^[A-Za-z0-9]+$/;
    if (!reg.test(val.userID)) {
        fail(res, '用户名必须是字母和数字');
        return;
    }
    if (!util.isEmail(val.email)) {
        fail(res, '邮箱格式不正确');
        return;
    }
    var crypto = require('crypto');
    var md5 = crypto.createHash('md5');
    md5.update(val.password + salt + val.userID);
    val.password = md5.digest('hex');
    val.auth = 255;
    User.create(val, function (error) {
        if (error) {
            //console.log(error);
            var data = '发生错误';
            if (error.code == 11000) data = '用户名已经注册';
            fail(res, data);
        } else {
            delete val.password;
            val.regTime = new Date();
            req.session.userInfo = val;
            req.session.isMe = val;
            res.render('doRegister', { title: '注册-思春网', active: 'register', info: '注册成功', succ: true, fr: fr });
        }
    });
});
 
module.exports = router;
