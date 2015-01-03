var express = require('express');
var router = express.Router();
var Blog = require('../../models/blog');
var Tag = require('../../models/tag');
var util = require('../../common/util');
function updateTag(data, articleID, res) {
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
    Tag.remove({ articleID: articleID }, function (error) {
        Tag.create(tag, function (err) {
            res.redirect('/article/' + articleID);
        });
    });
    
}
router.get('/doEdit', function(req, res) {
    var val = req.query;
    var params = 'title=' + escape(val.title) + '&tag=' + escape(val.tag)
            + '&content=' + escape(val.content);
    if (!req.session.userInfo) {
        params = '/edit?' + params;
        params = escape(params);
        res.redirect('/login?fr=' + params);
        return;
    }
    val.userID = req.session.userInfo.userID;
    val.seoKeywords = util.getSEOKeywords(val)
    val.seoDescription = util.getSEODescription(val);
    val.state = 1;
    Blog.update({ articleID: val.articleID },
        { '$set': val },
        function (error) {
            if (error) {
                console.log(error);
                res.redirect('/new?err=服务器出错,请稍候提交&' + params);
            } else {
                cache.tag = null;
                updateTag(val.tag, val.articleID, res);
            }
    });
});

module.exports = router;
