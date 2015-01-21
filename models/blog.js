var mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;
var autoinc  = require('mongoose-id-autoinc');
var db = mongoose.connection;
autoinc.init(db);
var BlogSchema = new Schema({
    customURL: { type: String, default: '' }, 
    userID: { type: String },
    title: { type: String },
    content: { type: String },
    browse: { type: Number, default: 0 },
    reply: { type: Number, default: 0 },
    tag: { type: String },
    state: { type: Number, default: 1 },
    seoKeywords: { type: String },
    seoDescription: { type: String },
    createTime: { type: Date, default: Date.now },
    modifyTime: { type: Date, default: Date.now }
});
BlogSchema.statics.findTotPage = function (callback) {
    if (cache.totPage) {
        callback(cache.totPage);
        return;
    }
    return this.model('Blog')
        .find()
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback(0);
            } else {
                callback((cache.totPage = Math.ceil(doc.length / config.aPageNum)));
            }
        });
}
BlogSchema.statics.findByPage = function (page, callback) {
    return this.model('Blog')
        .find()
        .sort({ createTime: -1 })
        .skip((page - 1) * config.aPageNum)
        .limit(config.aPageNum)
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}
BlogSchema.statics.updateReply = function (articleID, num, callback) {
    return this.model('Blog').update(
        { articleID: articleID },
        { '$inc': { reply: num } },
        function (error) {
            if(error) {
                console.log('updateReply');
                console.log(error);
            }
            callback();
        });
}
BlogSchema.statics.checkCustomURL = function (articleID, customURL, callback) {
    return this.model('Blog').find({ customURL: customURL },
        function (error, doc) {
            if (error) {
                console.log(error);
                callback(false);
            } else if (doc.length <= 0) {
                callback(true);
            } else if (doc.length == 1 && 
                doc[0].articleID == articleID) {
                    callback(true);
            } else {
                callback(false);
            }
        });
}
BlogSchema.statics.updateCustomURL = function (articleID, customURL, callback) {
    return this.model('Blog').update(
        { articleID: articleID },
        { '$set': { customURL: customURL } },
        function (error) {
            if(error) {
                console.log('updateCustomURL');
                console.log(error);
            }
            callback();
        });
}
BlogSchema.statics.updateVisit = function (articleID, num, callback) {
    return this.model('Blog').update(
        { articleID: articleID },
        { '$inc': { browse: num } },
        function (error) {
            if(error) {
                console.log('updateVisit');
                console.log(error);
            }
            callback();
        });
}
BlogSchema.statics.findArticleID = function (callback) {
    return this.model('Blog').find({ createTime:{ $gt: new Date(+new Date() - 3600000) } },
        function (error, doc) {
            if (error) {
                console.log(error);
                callback(-1);
            } else if (doc.length <= 0) {
                console.log('没有博客');
                callback(-1);
            } else {
                var id = -1;
                for (var i = doc.length - 1; i >= 0; i--) {
                    if (doc[i].articleID > id) id = doc[i].articleID;
                }
                callback(id);
            }
    });
}
BlogSchema.statics.findByArticleID = function(id, callback) {
    return this.model('Blog').find({
        articleID: id
    }, function (error, doc) {
            if (error) {
                console.log(error);
                callback(null);
            } else {
                //console.log(doc);
                if(doc.length == 0)
                    callback(null);
                else callback(doc[0]);
            }
    });
}
BlogSchema.statics.findByCustomURL = function(id, callback) {
    return this.model('Blog').find({
        customURL: id
    }, function (error, doc) {
            if (error) {
                console.log(error);
                callback(null);
            } else {
                //console.log(doc);
                if(doc.length == 0)
                    callback(null);
                else callback(doc[0]);
            }
    });
}
BlogSchema.statics.findByArticleIDs = function (idArr, callback) {
    return this.model('Blog').find({ articleID: {'$in': idArr } })
        .sort({ createTime: -1 })
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}
BlogSchema.statics.findByTime = function(time, callback) {
    return this.model('Blog')
        .find({ createTime: { $gt: time } })
        .sort({ createTime: -1 })
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}
BlogSchema.statics.findAll = function (callback) {
    return this.model('Blog')
        .find().sort({ createTime: -1 })
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback(null);
            } else {
                callback(doc);
            }
        });
}
BlogSchema.statics.updateXXX =function (id) {
    return this.model('Blog').update(
        { articleID: id },
        { '$set': { customURL: id } },
        function (error) {
        });
}
BlogSchema.plugin(autoinc.plugin, {
  model: 'Blog',
  field: 'articleID',
  start: 1,
  step: 1
});
module.exports = mongoose.model('Blog', BlogSchema); 