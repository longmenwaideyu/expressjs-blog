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
        }
    ], function (err, rs) {
        //console.log(rs);
        process(req, res, rs[0], rs[1], rs[2]);
    });
});

module.exports = router;
