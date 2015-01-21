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
         var ret = [];
        var retMap = {};
        for (var i = doc.length - 1; i >= 0; i--) {
            var id = retMap[doc[i].collect];
            if (id == null || id == undefined) {
                retMap[doc[i].collect] = ret.length;
                id = ret.length;
                ret.push({
                    collect: doc[i].collect
                });
            }
        };
        Blog.findAll(function (article) {
            res.render('collect/collectEdit', {
                title: config.blogName,
                isMe : req.session.isMe,
                collect: ret,
                article: article
            });
        });
    });
        
});

module.exports = router;
