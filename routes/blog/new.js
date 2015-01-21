var express = require('express');
var router = express.Router();

router.get('/new', function(req, res) {
    //    console.log(req.query);
    var val = req.query;
    val.title = val.title ? unescape(val.title) : '';
    val.tag = val.tag ? unescape(val.tag) : '';
    val.content = val.content ? unescape(val.content) : '';
    val.customURL = val.customURL ? unescape(val.customURL) : '';
    //val.content = val.content.replace(/\r\n/g, '');
    val.articleID = '';
    if (req.query && req.query.err) {
        res.render('blog/new', {
            title: config.blogName,
            user: req.session.userInfo,
            error: req.query.err,
            data: val,
            action: '/doNew'
        });
        return;
    }
    res.render('blog/new', {
        title: config.blogName,
        user: req.session.userInfo,
        data: val,
        action: '/doNew'
    });
});

module.exports = router;
