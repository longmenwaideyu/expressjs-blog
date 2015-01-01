var express = require('express');
var router = express.Router();
var Blog = require('../../models/blog');
var Collect = require('../../models/collect');
function saveCollect(data, map, res) {
    Collect.removeByCollect(data.collect, function () {
        var collect = [];
        var length = data.article.length;
        for (var i = 0; i < length; i++) {
            collect.push({
                collect: data.collect,
                seq: i,
                articleID: data.article[i],
                title: map[data.article[i]]
            });
        }
        Collect.insertCollect(collect, function () {
            cache.collect = null;
            res.redirect('/collect/edit');
        });
    });
}
router.get('/collect/doEdit', function(req, res) {
    var val = req.query;
    //console.log(val);
    //console.log(req.session.userInfo);
    var params = 'title=' + escape(val.title) + '&tag=' + escape(val.tag)
            + '&content=' + escape(val.content);
    if (!req.session.isMe) {
        //params = escape('/blog/new?' + params);
        params = '/collect/doEdit?' + params;
        params = escape(params);
        //console.log(params);
        res.redirect('/login?fr=' + params);
        return;
    }
    Blog.findByArticleIDs(val.article, function (doc) {
        var map = {};
        for (var i = doc.length - 1; i >= 0; i--) {
            map[doc[i].articleID] = doc[i].title;
        }
        saveCollect(val, map, res);
    });
});

module.exports = router;
