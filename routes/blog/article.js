var express = require('express');
var router = express.Router();
var Blog = require('../../models/blog');
var Reply = require('../../models/reply');
var Tag = require('../../models/tag');
var Collect = require('../../models/collect');
var util = require('../../common/util');
var async = require('async');
function fail(req, res, data) {
    res.render('blog/article', {
        doc: { noArticle: true, data: data }
    });
}
function recordVisit(articleID, callback) {
    Blog.updateVisit(articleID, 1, callback);
}
function genReply(doc) {
    var floor = [];
    var floorMap = {};
    var len = doc.length;
    for (var i = 0; i < len; i++) {
        if (doc[i].replyWhoID == -1) {
            doc[i].replyArr = [];
            doc[i].replyTime1 = util.getDate(doc[i].replyTime);
            floor.push(doc[i]);
            floorMap[doc[i].replyID] = i;
        } else {
            var f = floorMap[doc[i].replyFloor];
            if (f == null || f == undefined) continue;
            doc[i].replyTime1 = util.getDate(doc[i].replyTime);
            floor[f].replyArr.push(doc[i]);
        }
    }
    return floor;
}
router.get('/article/:id', function(req, res) {
    var id = req.params.id;
    if (id < 0) {
        fail(req, res, '文章ID不正确');
        return;
    }
    async.waterfall([
        function (callback) {
            Blog.findByArticleID(id, function(doc) {
                if (!doc) {
                    fail(req, res, '文章飞走了!')
                    return;
                }
                doc.tag = doc.tag || '';
                var arr = doc.tag.split(' ');
                for (var j =  arr.length - 1; j >= 0; j--) {
                    if (arr[j].length == 0)
                        arr.splice(j, 1);
                }
                doc.tagArr = arr;
                doc.createTime1 = util.getDate(doc.createTime);
                callback(null, doc);
            });
        },
        function (doc, callback) {
            util.getCollectArr([ doc ], function (doc) {
                callback(null, doc[0]);
            });
        },
        function (doc, callback) {
            Reply.findByArticleID(id, function (reply) {
                reply = genReply(reply);
                callback(null, doc, reply);
            });
        },
        function (doc, reply, callback) {
            recordVisit(id, function () {
                callback(null, doc, reply);
            });
        },
        function (doc, reply, callback){
            Tag.findAllTag(function (tag) {
                callback(null, doc, reply, tag);
            });
        },
        function (doc, reply, tag, callback) {
            Collect.findAllCollect(function (collect) {
                callback(null, doc, reply, tag, collect);
            });
        }
    ], function (err, doc, reply, tag, collect) {
        res.render('blog/article', {
            title: doc.title,
            article: doc,
            reply: reply,
            tag: tag,
            collect: collect,
            isMe: req.session.isMe,
            replyID: req.query.replyID
        });
    });
});

module.exports = router;
