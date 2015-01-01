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
    //val.content = val.content.replace(/\r\n/g, '');
    if (!val.title) {
        Blog.findByArticleID(val.articleID, function (doc) {
            //doc.content = doc.content.replace(/\r\n/g, '');
            process(req, res, doc);
        });
    } else {
        process(req, res, val);
    }
    
});

module.exports = router;
