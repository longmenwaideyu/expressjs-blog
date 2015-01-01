var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    console.log(req.query);
    res.render('login', { title: '登陆-博客', active: 'login' });
});
module.exports = router;
