var express = require('express');
var router = express.Router();
var Collect = require('../../models/collect');
var util = require('../../common/util');
router.get('/get/collectdetail', function(req, res) {
    var id = req.query.collectID;
    console.log(id);
    Collect.findByCollectID(id, function (doc) {
        res.json(doc);
    });
});

module.exports = router;
