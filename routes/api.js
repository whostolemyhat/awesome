var express = require('express');
var router = express.Router();

var Level = require('./app/models/level');

router.use(function(req, res, next) {
    console.log('Something happening');
    next();
});

router
    .get('/', function(req, res) {
        res.render('api', { title: 'API docs' });
    })
    .get('/levels', function(req, res) {
        res.render('upload', { title: 'Upload a new level' });
    })
    .post('/levels', function(req, res) {
        var map = new Level();
        map.name = req.body.name;
        map.data = req.body.data;
        map.img = req.body.img;

        map.save(function(err) {
            if(err) {
                res.send(err);
            }
            
            res.json({ message: 'Level created!' });
        });
    });

module.exports = router;
