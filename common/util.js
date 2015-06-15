var util = {};
var cheerio = require('cheerio');
var Collect = require('../models/collect');
var Tag = require('../models/tag');
var Blog = require('../models/blog');
var nodemailer = require('nodemailer');
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
/**
 * 标签和文集栏的数据
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
util.getSidebarInfo = function (callback) {
    Tag.findAllTag(function (tags) {
        Collect.findAllCollect(function (collects) {
                callback({ tags: tags, collects: collects });
        });
    });
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
util.getOutline = function (doc) {
    var $ = cheerio.load(doc.content);
    var dom = $('h1,h2,h3,h4,h5');
    var minH = 10
    dom.each(function (i, item) {
        var h = parseInt(item.name[1])
        if (h < minH) {
            minH = h
        }
    });
    var html = '';
    var hid = [0,0,0,0];
    dom.each(function (i, item) {
        var h = parseInt(item.name[1]) - minH;
        if (h <= 2) {
            var text = $(item).text();
            text = text.replace(/[\r|\n]/g, " ")
            html += '<p class="outline-' + h + '"><a href="#h' + (h + minH) + '_' + text.replace(/[\r|\n| |\'|\"|\\|\/]/g, "") + '">' + text + '</a></p>';
        }
    });
    return html;
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
/**
 * @param {String} subject：发送的主题
 * @param {String} html：发送的 html 内容
 */
util.sendMail = function(to, subject, html) {
    var smtpTransport = nodemailer.createTransport('SMTP', config.mailConfig);
    var mailOptions = {
        from: config.mailConfig.auth.user,
        to: to,
        subject: subject,
        html: html
    };
    smtpTransport.sendMail(mailOptions, function(error, response){
        if (error) {
            console.log(error);
        }
        smtpTransport.close();
    });
};
util.clone = function (json) {
    return JSON.parse(JSON.stringify(json));
}
module.exports = util;