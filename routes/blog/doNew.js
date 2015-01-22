var express = require('express');
var router = express.Router();
var Blog = require('../../models/blog');
var Tag = require('../../models/tag');
var util = require('../../common/util');
var async = require('async');
function saveTag(data, articleID, callback) {
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
    Tag.create(tag, function (err) {
        callback();
    });
}
router.get('/doNew', function(req, res) {
    var val = req.query;
    var params = 'title=' + escape(val.title) + '&tag=' + escape(val.tag)
            + '&content=' + escape(val.content) + '&customURL=' + escape(val.customURL);
    if (!req.session.userInfo) {
        params = '/new?' + params;
        params = escape(params);
        res.redirect('/login?fr=' + params);
        return;
    }
    if (!val.title || !val.content) {
        res.redirect('/new?err=信息不完整&' + params);
        return;
    }
    val.userID = req.session.userInfo.userID;
    val.seoKeywords = util.getSEOKeywords(val)
    val.seoDescription = util.getSEODescription(val);
    val.state = 1;
    val.customURL = val.customURL.replace(/\s/g, '_');
    delete val.articleID;
    async.waterfall([
        function (callback) {
            Blog.checkCustomURL('', val.customURL, function (res) {
                if (!res) {
                    callback('自定义url被占用');
                } else {
                    callback(null);
                }
            });
        },
        function (callback) {
            Blog.create(val, function (error) {
                if (error) {
                    console.log(error);
                    callback('写数据库错误');
                } else {
                    callback(null);
                }
            });
        },
        function (callback) {
            Blog.findArticleID(function (id) {
                //清除缓存。下次使用时会更新
                cache.totPage = null;
                cache.tag = null;
                cache.collect = null;
                cache.articleNum = null;
                callback(null, id);
            });
        },
        function (id, callback) {
            saveTag(val.tag, id, function () {
                callback(null, id);
            });
        },
        function (id, callback) {
            if (!val.customURL) {
                val.customURL = id;
                Blog.updateCustomURL(id, id, function () {
                    callback(null, id);
                });
            } else {
                callback(null, id);
            }
        }],
    function (err, id) {
        //console.log(err);
        if (err) {
            res.redirect('/new?err=' + err + '&' + params);
        } else if (id == -1) {
            res.redirect('/new?err=文章飞了！去博客中找找&' + params);
        } else {
            res.redirect('/article/' + val.customURL);
        }
    });
});

module.exports = router;
