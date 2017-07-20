var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('streamkit', {title: 'Streamkit'});
});

module.exports = router;
