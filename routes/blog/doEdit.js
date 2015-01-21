var express = require('express');
var router = express.Router();
var Blog = require('../../models/blog');
var Tag = require('../../models/tag');
var util = require('../../common/util');
var async = require('async');
function updateTag(data, articleID, callback) {
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
            if (err) {
                console.log(err);
            }
            callback();
        });
    });
}
router.get('/doEdit', function(req, res) {
    var val = req.query;
    var params = 'title=' + escape(val.title) + '&tag=' + escape(val.tag)
            + '&content=' + escape(val.content) + '&customURL=' + escape(val.customURL);
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
    val.customURL = val.customURL.replace(/\s/g, '_');
    val.customURL = val.customURL || val.articleID;
    //console.log(val);
    async.series([
        function (callback) {
            Blog.checkCustomURL(val.articleID, val.customURL, function (res) {
                if (!res) {
                    //console.log('自定义url被占用')
                    callback('自定义url被占用');
                } else {
                    callback(null);
                }
            });
        },
        function (callback) {
            console.log('更新博客');
            Blog.update({ articleID: val.articleID },
                { '$set': val },
                function (error) {
                    if (error) {
                        console.log('更新博客时错误');
                        console.log(error);
                        callback('读写数据库时发生错误');
                    } else {
                        cache.tag = null;
                        callback(null);
                    }
            });
        },
        function (callback) {
            updateTag(val.tag, val.articleID, function () {
                callback(null);
            });
        }],
        function (err, rs) {
            if (err) {
                res.redirect('/new?err=' + err + '&' + params);
            } else {
                res.redirect('/article/' + val.customURL);
            }
    });    
});

module.exports = router;
