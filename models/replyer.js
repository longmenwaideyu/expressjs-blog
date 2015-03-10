var mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;
var autoinc  = require('mongoose-id-autoinc');
var ReplyerSchema = new Schema({  
    email: { type: String },
    nick: { type: String },
    website: { type: String },
    createTime: { type: Date, default: Date.now }
});

ReplyerSchema.plugin(autoinc.plugin, {
    model: 'Replyer',
    field: 'replyerID',
    start: 10000,
    step: 1
});
ReplyerSchema.statics.findEmailByReplyerID = function (admin, callback) {
    return this.model('Reply')
        .find({ userID: { '$nin': [ admin ] } })
        .sort({ replyTime: -1 })
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}
module.exports = mongoose.model('Replyer', ReplyerSchema); 
