var express = require('express');
var router = express.Router();

const QuizFileService = require('../services/QuizFileService');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('Welcome to Quizzer!!');
});

router.get('/users', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/namelist', function(req, res) {
    QuizFileService.getQuizFileList()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(500).send(error);
        });

});

module.exports = router;