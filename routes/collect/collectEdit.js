var express = require('express');
var router = express.Router();
var Collect = require('../../models/collect');
var Blog = require('../../models/blog');
var util = require('../../common/util');
router.get('/collect/edit', function(req, res) {
    /*if (!req.session.isMe) {
        res.end();
        return;
    }*/
    Collect.findAll(function (doc) {
        Blog.findAll(function (article) {
            res.render('collect/collectEdit', {
                title: config.blogName,
                isMe : req.session.isMe,
                collect: doc,
                article: article
            });
        });
    });
        
});

module.exports = router;
