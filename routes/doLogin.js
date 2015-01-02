var express = require('express');
var router = express.Router();
var User = require('../models/user');
var salt = 'ILoveXiaoMei';
function fail(res, data) {
    res.render('doLogin', { title: '登录-博客', active: 'login', info: data, succ: false, fr: '/login' });
}
router.get('/', function(req, res) {
    var val = req.query;
    val.userID = val.userID.trim();
    var fr = val.fr || '/admin';
    delete val.fr;
    if (!val.userID || !val.password) {
        var data = '';
        if (!val.userID) data = '用户名不能为空';
        if (!val.password) data = '密码不能为空';
        fail(res, data);
        return;
    }
    User.find({ userID: val.userID }, function (error, doc) {
        if (error) {
            var data = '发生错误';
            fail(res, data);
        } else {
            if (doc.length == 0) {
                fail(res, '用户名不存在');
                return;
            }
            doc = doc[0];
            //console.log(doc);
            var crypto = require('crypto');
            var md5 = crypto.createHash('md5');
            md5.update(val.password + salt + val.userID);
            //console.log(doc.password);
            //console.log(md5.digest('hex'));
            if (doc.password == md5.digest('hex')) {
                delete doc.password;
                delete doc._id;
                delete doc.__v;
                req.session.userInfo = doc;
                req.session.isMe = true;
                var params = fr.split('?');
                fr = params.join('?');
                res.redirect(fr);
            } else {
                var data = '密码错误';
                fail(res, data);
            }
        }
    });
});
 
module.exports = router;
