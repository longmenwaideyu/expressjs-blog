var mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;
var CollectSchema = new Schema({  
    collect: { type: String },
    articleID: { type: Number },
    title: { type: String },
    seq: { type: Number },
    createTime: { type: Date, default: Date.now }
});
CollectSchema.statics.findAllCollect = function (callback) {
    if (cache.collect) {
        callback(cache.collect);
        return;
    }
    return this.model('Collect').find({}, function (error, doc) {
        if (error) {
            console.log(error);
            callback({});
        } else {
            var collect = {};
            for (var i = doc.length - 1; i >= 0; i--) {
                if (!collect[doc[i].collect])
                    collect[doc[i].collect] = 0;
                collect[doc[i].collect] ++;
            }
            cache.collect = collect;
            callback(collect);
        }
    })
}
CollectSchema.statics.findByArticleIDs = function (article, callback) {
    return this.model('Collect')
        .find({ articleID: { '$in': article } })
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
CollectSchema.statics.findByCollectID = function (id, callback) {
    return this.model('Collect')
        .find({ collect: id })
        .sort({ seq: 1 })
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        })
}
CollectSchema.statics.removeByCollect = function (id, callback) {
    return this.model('Collect').remove({ collect: id }, function (error) {
        //console.log('remove');
        callback();
    });
}
CollectSchema.statics.insertCollect = function (data, callback) {
    return this.model('Collect').create(data, function (error) {
        //console.log('insertCollect');
        callback();
    });
}
CollectSchema.statics.findAll = function (callback) {
    return this.model('Collect')
        .find({})
        .sort({ seq: -1 })
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}
module.exports = mongoose.model('Collect', CollectSchema); 