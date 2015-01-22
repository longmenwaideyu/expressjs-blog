var express = require('express');
var router = express.Router();
var Blog = require('../models/blog');
var Tag = require('../models/tag');
var Collect = require('../models/collect');
var util = require('../common/util');
var async = require('async');
function process(req, res, totPage, tag, collect) {
    var page = 1;
    if (req.query) {
        page = req.query.page || 1;
    }
    Blog.findByPage(page, function (doc) {
        doc = util.getAbstract(doc);
        doc = util.getTagArr(doc);
        util.getCollectArr(doc, function (doc) {

            var ownerInfo = {
                ownerName: config.ownerName,
                ownerLocation: config.ownerLocation,
                motto: config.motto,
                articleNum: util.getArticleNum()
            }
            res.render('index', {
                title: config.blogName,
                isMe : req.session.isMe,
                doc: doc,
                tag: tag,
                collect: collect,
                totPage: totPage,
                curPage: page
            });
        });
    });
}
router.get('/', function(req, res) {
    var page = 1;
    if (req.query) {
        page = req.query.page || 1;
    }
    async.series([
        function (callback){
            Blog.findTotPage(function (totPage) {
                callback(null, totPage);
            });
        },
        function (callback){
            Tag.findAllTag(function (tag) {
                callback(null, tag);
            });
        },
        function (callback) {
            Collect.findAllCollect(function (collect) {
                callback(null, collect);
            });
        },
        function (callback) {
            //加工一下本页的文章
            Blog.findByPage(page, function (doc) {
                doc = util.getAbstract(doc);
                doc = util.getTagArr(doc);
                util.getCollectArr(doc, function (doc) {
                    callback(null, doc);
                });
            });
        },
        function (callback) {
            //博主信息
            util.getArticleNum(function (articleNum) {
                var ownerInfo = {
                    ownerName: config.ownerName,
                    ownerLocation: config.ownerLocation,
                    ownerOccupation: config.ownerOccupation,
                    ownerSkill: config.ownerSkill,
                    motto: config.motto,
                    articleNum: articleNum
                };
                callback(null, ownerInfo);
            });
        }
    ], function (err, rs) {
        res.render('index', {
            title: config.blogName,
            isMe : req.session.isMe,
            doc: rs[3],
            tag: rs[1],
            collect: rs[2],
            totPage: rs[0],
            ownerInfo: rs[4],
            curPage: page
        });
    });
});

module.exports = router;
