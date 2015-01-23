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
        noArticle: true,
        data: data
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
    async.waterfall([
        function (callback) {
            Blog.findByCustomURL(id, function(doc) {
                if (!doc) {
                    console.log('文章不存在');
                    callback('文章不存在');
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
            Reply.findByArticleID(doc.articleID, function (reply) {
                reply = genReply(reply);
                callback(null, doc, reply);
            });
        },
        function (doc, reply, callback) {
            recordVisit(doc.articleID, function () {
                callback(null, doc, reply);
            });
        },
        //右侧边栏数据
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
        if (err) {
            fail(req, res, err);
            return;
        }

        res.render('blog/article', {
            title: doc.title,
            article: doc,
            reply: reply,
            tags: tag,
            collects: collect,
            isMe: req.session.isMe,
            replyID: req.query.replyID
        });
    });
});

module.exports = router;
