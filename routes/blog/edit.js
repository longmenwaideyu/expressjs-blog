var express = require('express');
var router = express.Router();
var Blog = require('../../models/blog');
function process (req, res, val) {
    if (req.query && req.query.err) {
        res.render('blog/new', {
            title: config.blogName,
            user: req.session.userInfo,
            error: req.query.err,
            data: val,
            action: '/doEdit'
        });
        return;
    }
    res.render('blog/new', {
        title: config.blogName,
        user: req.session.userInfo,
        data: val,
        action: '/doEdit'
    });
}
router.get('/edit', function(req, res) {
    var val = req.query;
    val.articleID = val.articleID || '';
    val.title = val.title ? unescape(val.title) : '';
    val.tag = val.tag ? unescape(val.tag) : '';
    val.content = val.content ? unescape(val.content) : '';
    val.customURL = val.customURL ? unescape(val.customURL) : '';
    if (!val.title) {
        Blog.findByArticleID(val.articleID, function (doc) {
            process(req, res, doc);
        });
    } else {
        //这里是如果编辑提交后，发现没有登陆，会返回到这里
        process(req, res, val);
    }
    
});

module.exports = router;
