var express = require('express');
var router = express.Router();

var usersRouter = require('./routes/users');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('Welcome to Quizzer!!');
});

router.get('/users', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;