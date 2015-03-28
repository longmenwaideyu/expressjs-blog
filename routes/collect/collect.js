var express = require('express');
var router = express.Router();
var Blog = require('../../models/blog');
var Collect = require('../../models/collect');
var Tag = require('../../models/tag');
var util = require('../../common/util');
var async = require('async');
router.get('/collect', function(req, res) {
    async.waterfall([
        function (callback){
            Collect.findAll(function (doc) {
                callback(null, doc);
            });
        },
        function (doc, callback) {
            var ids = [];
            for (var i = doc.length - 1; i >= 0; i--) {
                ids.push(doc[i].articleID);
            };
            Blog.findByArticleIDs(ids, function (article) {
                var ret = [];
                var retMap = {};
                var articleMap = {};
                for (var i = article.length - 1; i >= 0; i--) {
                    articleMap[article[i].articleID] = article[i];
                };
                //处理出每个collect下有哪些文章
                for (var i = doc.length - 1; i >= 0; i--) {
                    var id = retMap[doc[i].collect];
                    if (id == null || id == undefined) {
                        retMap[doc[i].collect] = ret.length;
                        id = ret.length;
                        ret.push({
                            collect: doc[i].collect,
                            article: []
                        });
                    }
                    ret[id].article.push(articleMap[doc[i].articleID]);
                };
                callback(null, ret);
            });

        },
        //右侧边栏数据
        function (doc, callback){
            util.getSidebarInfo(function (data) {
                callback(null, doc, data.tags, data.collects);
            });
        }
    ], function (err, doc, tags, collects) {
        res.render('collect/collect', {
            title: config.blogName,
            isMe : req.session.isMe,
            doc: doc,
            tags: tags,
            collects: collects
        });
    });
});

module.exports = router;
