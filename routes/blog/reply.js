var express = require('express');
var router = express.Router();
var Reply = require('../../models/reply');
var Blog = require('../../models/blog');
var util = require('../../common/util');
var URL = require('url');
function fail(res, data) {
    res.render('blog/reply', { data: data });
}
function sendMail (val, req) {
    var p = URL.parse(req.url); 
    var html = [val.nick, ' 在 ', config.blogName, ' 回复您:<br/>',
        val.content, '<br/><a href="', p.protocol, '//', p.host, '/',
        val.customURL, '?replyID=', val.replyWhoID, '" target="_blank">详情请点击这里<a/>',
        '<br/><strong>请不要直接回复此邮件</strong>'].join('');
}
router.get('/reply', function(req, res) {
    var query = req.query;
    var val = JSON.parse(query.data_reply);
    val.content = query.editorValue;
    val.replyWhoID = val.replyID;
    val.replyWhoNick = val.nick;
    val.replyWhoWebsite = val.website;
    delete val.replyID;
    delete val.replyTime;
    if (!val.replyWhoID) {
        val.replyWhoID = -1;
        val.replyFloor = -1;
        val.replyWhoNick = '**';
        val.replyWhoWebsite = '/';
    }
    val.website = query.website.trim();
    val.nick = query.nick.trim();
    val.email = query.email.trim();
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
            res.redirect('/article/' + val.customURL + '?err=服务器出错');
        } else {
            Blog.updateReply(val.articleID, 1, function () {
                res.redirect('/article/' + val.customURL);
            });
        }
    });
    sendMail(val, req);
});

module.exports = router;
