var express = require('express');
var router = express.Router();
var Collect = require('../../models/collect');
var Tag = require('../../models/tag');
var util = require('../../common/util');
var async = require('async');
router.get('/collect', function(req, res) {
    async.series([
        function (callback){
            Collect.findAll(function (doc) {
                callback(null, doc);
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
        res.render('collect/collect', {
            title: config.blogName,
            isMe : req.session.isMe,
            doc: rs[0],
            tag: rs[1],
            collect: rs[2]
        });
    });
/*
    Collect.findAll(function (doc) {
        Tag.findAllTag(function (tag) {
            Collect.findAllCollect(function (collect) {
                res.render('collect/collect', {
                    title: config.blogName,
                    isMe : req.session.isMe,
                    doc: doc,
                    tag: tag,
                    collect: collect
                });
            });
        });
    });     */
});

module.exports = router;
