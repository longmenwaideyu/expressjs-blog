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
            res.render('collect/collectSingle', {
                title: collect,
                article: art,
                collect: collect
            });
        })
        
    });
        
});

module.exports = router;
