var mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;
var TagSchema = new Schema({  
    tag: { type: String },
    articleID: { type: Number },
    createTime: { type: Date, default: Date.now }
});
TagSchema.statics.findAllTag = function (callback) {
    if (cache.tag) {
        callback(cache.tag);
        return;
    }
    return this.model('Tag').find({}, function (error, doc) {
        if (error) {
            console.log(error);
            callback({});
        } else {
            var tag = {};
            for (var i = doc.length - 1; i >= 0; i--) {
                if (!tag[doc[i].tag])
                    tag[doc[i].tag] = 0;
                tag[doc[i].tag] ++;
            }
            cache.tag = tag;
            callback(tag);
        }
    })
}
TagSchema.statics.findByTag = function (tag, callback) {
    return this.model('Tag')
        .find({ tag: tag })
        .sort({ createTime: -1})
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}
module.exports = mongoose.model('Tag', TagSchema); 