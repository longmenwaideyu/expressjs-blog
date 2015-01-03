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
        function (doc, callback){
            Tag.findAllTag(function (tag) {
                callback(null, [ doc, tag ]);
            });
        },
        function (rs, callback) {
            Collect.findAllCollect(function (collect) {
                rs.push(collect);
                callback(null, rs);
            });
        }
    ], function (err, rs) {
//        console.log(rs);
        res.render('blog/tag', {
            title: config.blogName,
            isMe : req.session.isMe,
            doc: rs[0],
            tag: rs[1],
            collect: rs[2]
        });
    });    
});

module.exports = router;
