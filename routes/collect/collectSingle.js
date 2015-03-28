var express = require('express');
var router = express.Router();
var Collect = require('../../models/collect');
var Tag = require('../../models/tag');
var Blog = require('../../models/blog');
var util = require('../../common/util');
var async = require('async');
router.get('/collect/cid/:id', function(req, res) {
    var collect = req.params.id;
    async.waterfall([
        function (callback) {
            Collect.findByCollectID(collect, function (doc) {
                //一个文集下的文章ID
                var article = [];
                for (var i = doc.length - 1; i >= 0; i--) {
                    article.push(doc[i].articleID);
                }
                callback(null, article);
            });
        },
        function (article, callback) {
            //查找文章的所有信息
            Blog.findByArticleIDs(article, function (art) {
                //文章ID-->下标的映射
                var articleMap = {};
                for (var i = art.length - 1; i >= 0; i--) {
                    articleMap[art[i].articleID] = i;
                };
                //按文集中顺序重排文章
                var doc = [];
                for (var i = article.length - 1; i >= 0; i--) {
                    doc.push(art[articleMap[article[i]]]);
                }
                doc = util.getAbstract(doc);
                doc = util.getTagArr(doc);
                //console.log(doc);
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
            res.render('collect/collectSingle', {
                title: collect,
                doc: doc,
                collects: collects,
                tags: tags,
                collect: collect
            });
    });
});

module.exports = router;
