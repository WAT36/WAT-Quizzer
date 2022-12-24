import express, { Router } from 'express'

import { getBackendLogger } from '../../common/Logger'
const logger = getBackendLogger()

const router: Router = express.Router()

import { getPartsofSpeechService } from '../../services/english/PartsofSpeechService'
import {
  addWordAndMeanService,
  getWordMeanService,
  searchWordService
} from '../../services/english/WordService'

router.get('/partsofspeech', function (req, res) {
  getPartsofSpeechService()
    .then((result: any) => {
      logger.debug('/english/partsofspeech')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/english/partsofspeech')
      logger.error(error)
      res.status(500).send(error)
    })
})

// meanArrayData: [
//  {
//    partOfSpeechId: 品詞ID(number)
//    meaning: 意味(string)
//  }
//  ・・・
// ]
router.post('/word/add', function (req, res) {
  addWordAndMeanService(
    req.body.wordName,
    req.body.pronounce,
    req.body.meanArrayData
  )
    .then((result: any) => {
      logger.debug('/english/word/add')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/english/word/add')
      logger.error(error)
      res.status(500).send(error)
    })
})

// 単語検索
/**リクエストデータ
 * {
 *  wordName: 単語名
 * }
 */
router.post('/word/search', function (req, res) {
  searchWordService(req.body.wordName)
    .then((result: any) => {
      logger.debug('/english/word/search')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/english/word/search')
      logger.error(error)
      res.status(500).send(error)
    })
})

// 単語意味取得
/**リクエストデータ
 * {
 *  wordName: 単語名
 * }
 */
router.post('/word/mean', function (req, res) {
  getWordMeanService(req.body.wordName)
    .then((result: any) => {
      logger.debug('/english/word/mean')
      res.status(200).send(result)
    })
    .catch((error: any) => {
      logger.error('/english/word/mean')
      logger.error(error)
      res.status(500).send(error)
    })
})

export default router
