var express = require('express');
var router = express.Router();
var Blog = require('../../models/blog');
var Collect = require('../../models/collect');
var Tag = require('../../models/tag');
var util = require('../../common/util');
var async = require('async');
router.get('/tag/:tag', function(req, res) {
    var tag = req.params.tag;
    async.waterfall([
        function (callback) {
            Tag.findByTag(tag, function (doc) {
                var ids = [];
                for (var i = doc.length - 1; i >= 0; i--) {
                    ids.push(doc[i].articleID);
                };
                //console.log(ids);
                callback(null, ids);
            });
        },
        function (ids, callback) {
            Blog.findByArticleIDs(ids, function (doc) {
                doc = util.getAbstract(doc);
                doc = util.getTagArr(doc);
                callback(null, doc);
            });
        },
        function (doc, callback) {
            util.getCollectArr(doc, function (doc) {
                callback(null, doc);
            });
        },
        //右侧边栏数据
        function (doc, callback){
            util.getSidebarInfo(function (data) {
                callback(null, doc, data.tags, data.collects);
            });
        }
    ], function (err, doc, tags, collects) {
        res.render('blog/tag', {
            title: config.blogName,
            isMe : req.session.isMe,
            doc: doc,
            tags: tags,
            collects: collects
        });
    });    
});

module.exports = router;
