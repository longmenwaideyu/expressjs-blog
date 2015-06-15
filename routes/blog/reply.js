var express = require('express');
var router = express.Router();
var Reply = require('../../models/reply');
var Blog = require('../../models/blog');
var util = require('../../common/util');
function fail(res, data) {
    res.render('blog/reply', { data: data });
}
function sendMail (val, req) {
    if (val.replyWhoID == -1) return;
    var url = req.protocol + '://' + req.hostname + '/article/' + val.customURL + '?replyID=' + val.replyWhoID;
    var subject = ['新回复通知[', req.hostname, ']'].join();
    var html = [val.nick, ' 在 ', config.blogName, '[', req.hostname, '] 回复您:<br/>',
        val.content, '<br/><a href="', url, '" target="_blank">详情请点击', url, '<a/>',
        '<br/><strong>请不要直接回复此邮件</strong>'].join('');
    Reply.findEmailByReplyID(val.replyWhoID, function (email) {
        if (email) {
            util.sendMail(email, subject, html);
        }
    });
}
router.get('/reply', function(req, res) {
    var query = req.query;
    var val = {};
    if (query.data_reply) {
        val = JSON.parse(query.data_reply);
        val.content = query.editorValue;
        val.replyWhoID = val.replyID;
        val.replyWhoNick = val.nick;
        val.replyWhoWebsite = val.website;
        if (val.replyFloor == -1) {//这是本楼楼主
            val.replyFloor = val.replyID;
        }
        delete val.replyID;//这两个都是上一楼的,无用了
        delete val.replyTime;//
    } else {
        //新楼的处理
        val.content = query.editorValue;
        val.articleID = query.articleID;
        val.customURL = query.customURL;
    }
    if (!val.replyWhoID) {
        val.replyWhoID = -1;
        val.replyFloor = -1;
        val.replyWhoNick = '**';
        val.replyWhoWebsite = '/';
    }
    //加入本层的信息
    val.website = query.website.trim();
    val.nick = query.nick.trim();
    val.email = query.email.trim();
    if (!util.isEmail(val.email)) {
        fail(res, '邮箱格式不正确');
        return;
    }
    if (val.website.indexOf('http://') != 0
        && val.website.indexOf('javascript:void(0)') != 0) {
        val.website = 'http://' + val.website;
    }
    //标记是博主的回复
    if (req.session.isMe) {
         val.userID = req.session.userInfo.userID;
         val.nick = req.session.userInfo.nick;
    }
    console.log(val);
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
