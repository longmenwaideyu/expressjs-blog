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
function genReply(doc, article) {
    var floor = [];
    var floorMap = {};
    var len = doc.length;
    var idx = 0;
    for (var i = 0; i < len; i++) {
        var item = util.clone(doc[i]);
        delete item.__v;
        delete item._id;
        delete item.email;
        delete item.userID;
        delete item.isPass;
        item.customURL = article.customURL;
        item.replyTime = util.getDate(item.replyTime);
        var content = item.content;
        delete item.content;
        item.dataStr = JSON.stringify(item);
        item.content = content;
        if (item.replyWhoID == -1) {
            item.replyArr = [];
            floor.push(item);
            floorMap[item.replyID] = idx++;
        } else {
            var f = floorMap[item.replyFloor];
            if (f == null || f == undefined) continue;
            floor[f].replyArr.push(item);
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
                reply = genReply(reply, doc);
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
            util.getSidebarInfo(function (data) {
                callback(null, doc, reply, data.tags, data.collects);
            });
        },
        function (doc, reply, tags, collects, callback) {
            var data = util.getOutline(doc);
            callback(null, doc, reply, tags, collects, data);
        }
    ], function (err, doc, reply, tags, collects, outline) {
        if (err) {
            fail(req, res, err);
            return; 
        }
        console.log(outline)
        res.render('blog/article', {
            title: doc.title,
            article: doc,
            reply: reply,
            tags: tags,
            collects: collects,
            outline: outline,
            isMe: req.session.isMe,
            replyID: req.query.replyID
        });
    });
});

module.exports = router;
