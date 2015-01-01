var express = require('express');
var router = express.Router();
var Collect = require('../../models/collect');
var Blog = require('../../models/blog');
var util = require('../../common/util');
router.get('/collect/cid/:id', function(req, res) {
    var collect = req.params.id;
    Collect.findByCollectID(collect, function (doc) {
        var article = [];
        for (var i = doc.length - 1; i >= 0; i--) {
            article.push(doc[i].articleID);
        }
        Blog.findByArticleIDs(article, function (art) {
            art = util.getAbstract(art);
            var articleMap = {};
            for (var i = art.length - 1; i >= 0; i--) {
                articleMap[art[i].articleID] = i;
            };
            var doc = [];
            for (var i = article.length - 1; i >= 0; i--) {
                doc.push(art[articleMap[article[i]]]);
            };
            res.render('collect/collectSingle', {
                title: collect,
                article: doc,
                collect: collect
            });
        })
        
    });
        
});

module.exports = router;
