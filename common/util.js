var util = {};
var cheerio = require('cheerio');
var Collect = require('../models/collect');
var Blog = require('../models/blog');
util.isEmail = function (email) {
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    return reg.test(email);
}
util.getDate =  function (date) {
    date = date || '';
    var d = new Date(date);
    var ret = (d.getYear() + 1900) + '/'
        + (d.getMonth() + 1) + '/' + d.getDate() + ' '
        + d.getHours() + ':' + d.getMinutes() + ':'
        + d.getSeconds();
    return ret;
}
util.getArticleNum = function (callback) {
    if (cache.articleNum) {
        callback(cache.articleNum);
    } else {
        Blog.findAll(function (doc) {
            doc = doc || [];
            cache.articleNum = doc.length;
            callback(doc.length);
        });
    }
}
util.getSEODescription = function (doc) {
    var $ = cheerio.load(doc.content);
    var id = [
        'h1',
        'h2',
        'h3',
        'h4',
        'strong'
    ];
    var ret = doc.title + ',';
    for (var i = 0; i < id.length; i++) {
        var t = $(id[i]).text().replace(/\s/g, '');
        if (!t) continue;
        t = t.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\（|\）|\《|\》|\、|\；|\：|\‘|\’|\“|\”|\，|\。|\？|\！|\·|\￥|\…|\—|\、]/g,',');
        t = t.replace(/[0-9]/g, ',');
        t = t.split(',');
        var length = t.length;
        for (var j = 0; j < length; j++) {
            if (t[j]) {
                ret += t[j];
            }
        }
        ret += ',';
        if (ret.length > 155) break;
    }
    return ret;
}
util.getSEOKeywords = function (doc) {
    return doc.tag.replace(/\s/g, ',') + ',' + doc.title;
}
util.getSEO = function (doc) {
    var seo = {};
    seo.keywords = util.getSEOKeywords(doc);
    seo.description = util.getSEODescription(doc);
    return seo;
}
util.getAbstract = function (doc) {
    for (var i = doc.length - 1; i >= 0; i--) {
        var $ = cheerio.load(doc[i].content);
        doc[i].content = '';
        $('img').each(function (j, item) {
            if (j >= 3) return false;
            doc[i].content += '<img src="' + item.attribs.src + '">';
        });
        doc[i].content += $.root().text().substr(0, 300)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/'/g, '&quot;') + '...';
    };
    return doc;
}
util.getTagArr = function (doc) {
    for (var i = doc.length - 1; i >= 0; i--) {
        doc[i].createTime1 = util.getDate(doc[i].createTime);
        doc[i].tag = doc[i].tag || '';
        var arr = doc[i].tag.split(' ');
        for (var j =  arr.length - 1; j >= 0; j--) {
            if (arr[j].length == 0)
                arr.splice(j, 1);
        }
        doc[i].tagArr = arr;
    }
    return doc;
}
util.getCollectArr = function(doc, callback) {
    var article = [];
    var map = {};
    for (var i = doc.length - 1; i >= 0; i--) {
        article.push(doc[i].articleID);
        doc[i].collectArr = [];
        map[doc[i].articleID] = i;
    }
    Collect.findByArticleIDs(article, function (c) {
        var length = c.length;
        for (var i = 0; i < length; i++) {
            doc[map[c[i].articleID]].collectArr.push(c[i].collect);
        }
        callback(doc);
    })
}
module.exports = util;