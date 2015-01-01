var express = require('express');
var router = express.Router();
var Reply = require('../../models/reply');
var Blog = require('../../models/blog');
var util = require('../../common/util');
function fail(res, data) {
    res.render('blog/reply', { data: data });
}
router.get('/reply', function(req, res) {
    var val = req.query;
    val.content = val.editorValue;
    delete val.editorValue;
    if (!val.replyWhoID) {
        val.replyWhoID = -1;
        val.replyFloor = -1;
        val.replyWhoNick = '**';
        val.replyWhoWebsite = '/';
    }
    val.website = val.website.trim();
    val.nick = val.nick.trim();
    val.email = val.email.trim();
    if (!util.isEmail(val.email)) {
        fail(res, '邮箱格式不正确');
        return;
    }
    if (val.website.indexOf('http://') != 0
        && val.website.indexOf('https://') != 0
        && val.website.indexOf('javascript:void(0)') == 0) {
        val.website = 'http://' + val.website;
    }
    if (req.session.isMe) {
         val.userID = req.session.userInfo.userID;
         val.nick = req.session.userInfo.nick;
    }
    Reply.create(val, function (error) {
        if (error) {
            console.log(error);
            res.redirect('/article/' + val.articleID + '?err=服务器出错');
        } else {
            Blog.updateReply(val.articleID, 1, function () {
                res.redirect('/article/' + val.articleID);
            });
        }
    });
});

module.exports = router;
