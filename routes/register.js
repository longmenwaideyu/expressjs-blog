var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('register', { title: '注册-博客', active: 'register' });
});
 
module.exports = router;
