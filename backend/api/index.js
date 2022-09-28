var express = require("express");
var router = express.Router();

const logger = require("../common/Logger").getBackendLogger();

const QuizFileService = require("../services/QuizFileService");
const CategoryService = require("../services/CategoryService");
const QuizService = require("../services/QuizService");
const S3Service = require("../aws/S3Service");

const PartsofSpeechService = require("../services/english/PartsofSpeechService");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Welcome to Quizzer!!");
});

router.get("/namelist", function (req, res) {
  QuizFileService.getQuizFileList()
    .then((result) => {
      logger.debug("/namelist");
      res.status(200).send(result);
    })
    .catch((error) => {
      logger.error("/namelist");
      res.status(500).send(error);
    });
});

router.post("/get_category", function (req, res) {
  CategoryService.getCategoryList(req.body.file_num)
    .then((result) => {
      logger.debug("/get_category");
      res.status(200).send(result);
    })
    .catch((error) => {
      logger.error("/get_category");
      res.status(500).send(error);
    });
});

router.post("/get_quiz", function (req, res) {
  QuizService.getQuiz(req.body.file_num, req.body.quiz_num)
    .then((result) => {
      if (result.length > 0) {
        logger.debug("/get_quiz");
        res.status(200).send(result);
      } else {
        logger.error("/get_quiz");
        res.status(404).send(result);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post("/random", function (req, res) {
  QuizService.getRandomQuiz(
    req.body.file_num,
    req.body.min_rate,
    req.body.max_rate,
    req.body.category,
    req.body.checked
  )
    .then((result) => {
      if (result.length > 0) {
        logger.debug("/random");
        res.status(200).send(result);
      } else {
        logger.error("/random");
        res.status(404).send(result);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post("/worst_rate", function (req, res) {
  QuizService.getWorstRateQuiz(
    req.body.file_num,
    req.body.category,
    req.body.checked
  )
    .then((result) => {
      if (result.length > 0) {
        logger.debug("/worst_rate");
        res.status(200).send(result);
      } else {
        logger.info("/worst_rate");
        res.status(404).send(result);
      }
    })
    .catch((error) => {
      logger.error("/worst_rate");
      res.status(500).send(error);
    });
});

router.post("/minimum_clear", function (req, res) {
  QuizService.getMinimumClearQuiz(
    req.body.file_num,
    req.body.category,
    req.body.checked
  )
    .then((result) => {
      if (result.length > 0) {
        logger.debug("/minimum_clear");
        res.status(200).send(result);
      } else {
        logger.info("/minimum_clear");
        res.status(404).send(result);
      }
    })
    .catch((error) => {
      logger.error("/minimum_clear");
      res.status(500).send(error);
    });
});

router.post("/correct", function (req, res) {
  QuizService.correctRegister(req.body.file_num, req.body.quiz_num)
    .then((result) => {
      logger.debug("/correct");
      res.status(200).send(result);
    })
    .catch((error) => {
      logger.error("/correct");
      res.status(500).send(error);
    });
});

router.post("/incorrect", function (req, res) {
  QuizService.incorrectRegister(req.body.file_num, req.body.quiz_num)
    .then((result) => {
      logger.debug("/incorrect");
      res.status(200).send(result);
    })
    .catch((error) => {
      logger.error("/incorrect");
      res.status(500).send(error);
    });
});

router.post("/add", function (req, res) {
  QuizService.addQuiz(req.body.file_num, req.body.data)
    .then((result) => {
      logger.debug("/add");
      res.status(200).send(result);
    })
    .catch((error) => {
      logger.error("/add");
      res.status(500).send(error);
    });
});

router.post("/edit", function (req, res) {
  QuizService.editQuiz(
    req.body.file_num,
    req.body.quiz_num,
    req.body.question,
    req.body.answer,
    req.body.category,
    req.body.img_file
  )
    .then((result) => {
      logger.debug("/edit");
      res.status(200).send(result);
    })
    .catch((error) => {
      logger.error("/edit");
      res.status(500).send(error);
    });
});

router.post("/search", function (req, res) {
  QuizService.searchQuiz(
    req.body.file_num,
    req.body.min_rate,
    req.body.max_rate,
    req.body.category,
    req.body.checked,
    req.body.query,
    req.body.cond
  )
    .then((result) => {
      if (result.length > 0) {
        logger.debug("/search");
        res.status(200).send(result);
      } else {
        logger.error("/search");
        res.status(404).send(result);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.post("/delete", function (req, res) {
  QuizService.deleteQuiz(req.body.file_num, req.body.quiz_num)
    .then((result) => {
      logger.debug("/delete");
      res.status(200).send(result);
    })
    .catch((error) => {
      logger.error("/delete");
      res.status(500).send(error);
    });
});

router.post("/integrate", function (req, res) {
  QuizService.integrateQuiz(
    req.body.pre_file_num,
    req.body.pre_quiz_num,
    req.body.post_file_num,
    req.body.post_quiz_num
  )
    .then((result) => {
      logger.debug("/integrate");
      res.status(200).send(result);
    })
    .catch((error) => {
      logger.error("/integrate");
      res.status(500).send(error);
    });
});

router.post("/category/renewal", function (req, res) {
  CategoryService.replaceAllCategory(req.body.file_num)
    .then((result) => {
      logger.debug("/category/renewal");
      res.status(200).send(result);
    })
    .catch((error) => {
      logger.error("/category/renewal");
      res.status(500).send(error);
    });
});

router.post("/category/accuracy_rate", function (req, res) {
  CategoryService.getAccuracyRateByCategory(req.body.file_num)
    .then((result) => {
      logger.debug("/category/accuracy_rate");
      res.status(200).send(result);
    })
    .catch((error) => {
      logger.error("/category/accuracy_rate");
      res.status(500).send(error);
    });
});

router.post("/upload", (req, res) => {
  S3Service.upload(req.body.params)
    .then((url) => {
      logger.debug("/upload");
      res.json({ url: url });
    })
    .catch((e) => {
      logger.error("/upload");
      console.log(e);
    });
});

router.get("/english/partsofspeech", function (req, res) {
  PartsofSpeechService.getPartsofSpeech()
    .then((result) => {
      logger.debug("/english/partsofspeech");
      res.status(200).send(result);
    })
    .catch((error) => {
      logger.error("/english/partsofspeech");
      res.status(500).send(error);
    });
});

module.exports = router;
