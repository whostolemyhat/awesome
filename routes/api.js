var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something happening');
    next();
});

router
    .get('/upload', function(req, res) {
        res.render('upload', { title: 'Upload a new map' });
    })
    .post('/upload', function(req, res) {
        res.json('something');
    });

module.exports = router;
