import express, { Router } from 'express'

import { getBackendLogger } from '../../common/Logger'
const logger = getBackendLogger()

const router: Router = express.Router()

import { getQuizFileListService } from '../../services/quizzer/QuizFileService'
import {
  getAccuracyRateByCategoryService,
  getCategoryListService,
  replaceAllCategoryService
} from '../../services/quizzer/CategoryService'
import {
  addCategoryToQuizService,
  addQuizService,
  checkToQuizService,
  correctRegisterService,
  deleteQuizService,
  editQuizService,
  getMinimumClearQuizService,
  getQuizService,
  getRandomQuizService,
  getWorstRateQuizService,
  incorrectRegisterService,
  integrateQuizService,
  removeCategoryFromQuizService,
  reverseCheckOfQuizService,
  searchQuizService,
  uncheckToQuizService
} from '../../services/quizzer/QuizService'
import { upload } from '../../aws/S3Service'

/* GET home page. */
router.get('/', function (req, res, next) {
  logger.debug('/')
  res.send('Welcome to Quizzer!!')
})

router.get('/namelist', function (req, res) {
  getQuizFileListService()
    .then((result: any) => {
      logger.debug('/namelist')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/namelist')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/get_category', function (req, res) {
  getCategoryListService(req.body.file_num)
    .then((result: any) => {
      logger.debug('/get_category')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/get_category')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/get_quiz', function (req, res) {
  getQuizService(req.body.file_num, req.body.quiz_num)
    .then((result: any) => {
      if (result.length > 0) {
        logger.debug('/get_quiz')
        res.status(200).send(result)
      } else {
        logger.error('/get_quiz')
        logger.error('404 Not Found')
        res.status(404).send(result)
      }
    })
    .catch((error: any) => {
      res.status(500).send(error)
      logger.error(error)
    })
})

router.post('/random', function (req, res) {
  getRandomQuizService(
    req.body.file_num,
    req.body.min_rate,
    req.body.max_rate,
    req.body.category,
    req.body.checked
  )
    .then((result: any) => {
      if (result.length > 0) {
        logger.debug('/random')
        res.status(200).send(result)
      } else {
        logger.error('/random')
        logger.error('404 Not Found')
        res.status(404).send(result)
      }
    })
    .catch((error: any) => {
      res.status(500).send(error)
      logger.error(error)
    })
})

router.post('/worst_rate', function (req, res) {
  getWorstRateQuizService(
    req.body.file_num,
    req.body.category,
    req.body.checked
  )
    .then((result: any) => {
      if (result.length > 0) {
        logger.debug('/worst_rate')
        res.status(200).send(result)
      } else {
        logger.info('/worst_rate')
        res.status(404).send(result)
      }
    })
    .catch((error: any) => {
      logger.error('/worst_rate')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/minimum_clear', function (req, res) {
  getMinimumClearQuizService(
    req.body.file_num,
    req.body.category,
    req.body.checked
  )
    .then((result: any) => {
      if (result.length > 0) {
        logger.debug('/minimum_clear')
        res.status(200).send(result)
      } else {
        logger.info('/minimum_clear')
        res.status(404).send(result)
      }
    })
    .catch((error: any) => {
      logger.error('/minimum_clear')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/correct', function (req, res) {
  correctRegisterService(req.body.file_num, req.body.quiz_num)
    .then((result: any) => {
      logger.debug('/correct')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/correct')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/incorrect', function (req, res) {
  incorrectRegisterService(req.body.file_num, req.body.quiz_num)
    .then((result: any) => {
      logger.debug('/incorrect')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/incorrect')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/add', function (req, res) {
  addQuizService(req.body.file_num, req.body.data)
    .then((result: any) => {
      logger.debug('/add')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/add')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/edit', function (req, res) {
  editQuizService(
    req.body.file_num,
    req.body.quiz_num,
    req.body.question,
    req.body.answer,
    req.body.category,
    req.body.img_file
  )
    .then((result: any) => {
      logger.debug('/edit')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/edit')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/search', function (req, res) {
  searchQuizService(
    req.body.file_num,
    req.body.min_rate,
    req.body.max_rate,
    req.body.category,
    req.body.checked,
    req.body.query,
    req.body.cond
  )
    .then((result: any) => {
      if (result.length > 0) {
        logger.debug('/search')
        res.status(200).send(result)
      } else {
        logger.error('/search')
        logger.error('404 Not Found')
        res.status(404).send(result)
      }
    })
    .catch((error: any) => {
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/delete', function (req, res) {
  deleteQuizService(req.body.file_num, req.body.quiz_num)
    .then((result: any) => {
      logger.debug('/delete')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/delete')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/integrate', function (req, res) {
  integrateQuizService(
    req.body.pre_file_num,
    req.body.pre_quiz_num,
    req.body.post_file_num,
    req.body.post_quiz_num
  )
    .then((result: any) => {
      logger.debug('/integrate')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/integrate')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/category/renewal', function (req, res) {
  replaceAllCategoryService(req.body.file_num)
    .then((result: any) => {
      logger.debug('/category/renewal')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/category/renewal')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/category/accuracy_rate', function (req, res) {
  getAccuracyRateByCategoryService(req.body.file_num)
    .then((result: any) => {
      logger.debug('/category/accuracy_rate')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/category/accuracy_rate')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/upload', (req, res) => {
  upload(req.body.params)
    .then((url: any) => {
      logger.debug('/upload')
      res.json({ url: url })
    })
    .catch((error: any) => {
      logger.error('/upload')
      logger.error(error)
    })
})

router.post('/edit/category/add', function (req, res) {
  addCategoryToQuizService(
    req.body.file_num,
    req.body.quiz_num,
    req.body.category
  )
    .then((result: any) => {
      logger.debug('/edit/category/add')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/edit/category/add')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/edit/category/remove', function (req, res) {
  removeCategoryFromQuizService(
    req.body.file_num,
    req.body.quiz_num,
    req.body.category
  )
    .then((result: any) => {
      logger.debug('/edit/category/remove')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/edit/category/remove')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/edit/check', function (req, res) {
  checkToQuizService(req.body.file_num, req.body.quiz_num)
    .then((result: any) => {
      logger.debug('/edit/check')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/edit/check')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/edit/uncheck', function (req, res) {
  uncheckToQuizService(req.body.file_num, req.body.quiz_num)
    .then((result: any) => {
      logger.debug('/edit/uncheck')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/edit/uncheck')
      logger.error(error)
      res.status(500).send(error)
    })
})

router.post('/edit/check/reverse', function (req, res) {
  reverseCheckOfQuizService(req.body.file_num, req.body.quiz_num)
    .then((result: any) => {
      logger.debug('/edit/check/reverse')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/edit/check/reverse')
      logger.error(error)
      res.status(500).send(error)
    })
})

export default router
