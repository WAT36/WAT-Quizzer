var express = require('express');
var router = express.Router();

const QuizFileService = require('../services/QuizFileService');
const CategoryService = require('../services/CategoryService');
const QuizService = require('../services/QuizService');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('Welcome to Quizzer!!');
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

router.post('/get_category', function(req, res) {
    CategoryService.getCategoryList(req.body.file_num)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

router.post('/get_quiz', function(req, res) {
    QuizService.getQuiz(req.body.file_num,req.body.quiz_num)
        .then((result) => {
            if(result.length > 0){
                res.status(200).send(result);
            }else{
                res.status(404).send(result);
            }
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

router.post('/random', function(req, res) {
    QuizService.getRandomQuiz(req.body.file_num,req.body.min_rate,req.body.max_rate,req.body.category,req.body.checked)
        .then((result) => {
            if(result.length > 0){
                res.status(200).send(result);
            }else{
                res.status(404).send(result);
            }
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

router.post('/worst_rate', function(req, res) {
    QuizService.getWorstRateQuiz(req.body.file_num,req.body.category,req.body.checked)
        .then((result) => {
            if(result.length > 0){
                res.status(200).send(result);
            }else{
                res.status(404).send(result);
            }
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

router.post('/minimum_clear', function(req, res) {
    QuizService.getMinimumClearQuiz(req.body.file_num,req.body.category,req.body.checked)
        .then((result) => {
            if(result.length > 0){
                res.status(200).send(result);
            }else{
                res.status(404).send(result);
            }
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

router.post('/correct', function(req, res) {
    QuizService.correctRegister(req.body.file_num,req.body.quiz_num)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

router.post('/incorrect', function(req, res) {
    QuizService.incorrectRegister(req.body.file_num,req.body.quiz_num)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

router.post('/add', function(req, res) {
    QuizService.addQuiz(req.body.file_num,req.body.data)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

router.post('/edit', function(req, res) {
    QuizService.editQuiz(req.body.file_num,req.body.quiz_num,req.body.question,req.body.answer,req.body.category,req.body.img_file)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

module.exports = router;