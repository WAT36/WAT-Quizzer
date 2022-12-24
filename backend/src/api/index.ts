import express from 'express'
const app: express.Express = express()

import quizzerController from './controller/Quizzer'
import englishBotController from './controller/EnglishBot'

import bodyParser from 'body-parser'
import cors from 'cors'
app.use(cors())

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

app.use('/', quizzerController)
app.use('/english', englishBotController)

const backendPort = process.env.BACKEND_PORT || 4000
app.listen(backendPort, () => {
  console.log(`ポート${backendPort}番で起動しました。`)
})
