var express = require('express');
var router = express.Router();
var Blog = require('../../models/blog');
var Tag = require('../../models/tag');
function saveTag(data, articleID, res) {
    if (articleID == -1) {
        res.redirect('/new?err=文章飞了！去博客中找找&' + params);
        return;
    }
    data = data.split(' ');
    var tag = [];
    for (var i = data.length - 1; i >= 0; i--) {
        if (data[i].length != 0) {
            tag.push({
                tag: data[i],
                articleID: articleID
            });
        }    
    }
//    console.log(tag);
    Tag.create(tag, function (err) {
        res.redirect('/article/' + articleID);
    });
}
router.get('/doNew', function(req, res) {
    var val = req.query;
    var params = 'title=' + escape(val.title) + '&tag=' + escape(val.tag)
            + '&content=' + escape(val.content);
    if (!req.session.userInfo) {
        //params = escape('/blog/new?' + params);
        params = '/new?' + params;
        params = escape(params);
        //console.log(params);
        res.redirect('/login?fr=' + params);
        return;
    }
    if (!val.title || !val.content) {
        res.redirect('/new?err=信息不完整&' + params);
        return;
    }
    val.userID = req.session.userInfo.userID;
    delete val.articleID;
    Blog.create(val, function (error) {
        if (error) {
            console.log(error);
            res.redirect('/new?err=服务器出错,请稍候提交&' + params);
        } else {
            Blog.findArticleID(function (id) {
                cache.totPage = null;
                cache.tag = null;
                cache.collect = null;
                saveTag(val.tag, id, res);
            });
        }
    });
});

module.exports = router;
