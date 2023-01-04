import React from 'react'
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormGroup,
  Typography,
  TextField,
  Input
} from '@material-ui/core'

import { get, post } from '../../common/API'
import QuizzerLayout from './components/QuizzerLayout'

const messageBoxStyle = {
  margin: '10px 0px 20px',
  borderStyle: 'none'
}

const buttonStyle = {
  margin: '10px'
}

interface EditQuizPageState {
  file_num: number
  message: string
  messageColor:
    | 'error'
    | 'initial'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'textPrimary'
    | 'textSecondary'
    | undefined
  quiz_num: number
  edit_file_num: number
  edit_quiz_num: number
  edit_question: string
  edit_answer: string
  edit_category: string
  edit_image: string
  filelistoption: JSX.Element[]
}

export default class EditQuizPage extends React.Component<
  {},
  EditQuizPageState
> {
  componentDidMount() {
    get('/namelist', (data: any) => {
      if (data.status === 200) {
        data = data.body
        let filelist = []
        for (var i = 0; i < data.length; i++) {
          filelist.push(
            <MenuItem value={data[i].file_num} key={data[i].file_num}>
              {data[i].file_nickname}
            </MenuItem>
          )
        }
        this.setState({
          filelistoption: filelist
        })
      } else {
        this.setState({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        })
      }
    })
  }

  constructor(props: any) {
    super(props)
    this.state = {
      file_num: -1,
      message: '　',
      messageColor: 'initial'
    } as EditQuizPageState
  }

  getQuiz = () => {
    if (this.state.file_num === -1) {
      this.setState({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error'
      })
      return
    } else if (!this.state.quiz_num) {
      this.setState({
        message: 'エラー:問題番号を入力して下さい',
        messageColor: 'error'
      })
      return
    }

    post(
      '/get_quiz',
      {
        file_num: this.state.file_num,
        quiz_num: this.state.quiz_num
      },
      (data: any) => {
        if (data.status === 200) {
          data = data.body
          this.setState({
            edit_file_num: data[0].file_num,
            edit_quiz_num: data[0].quiz_num,
            edit_question: data[0].quiz_sentense,
            edit_answer: data[0].answer,
            edit_category: data[0].category,
            edit_image: data[0].img_file,
            message: '　',
            messageColor: 'initial'
          })
        } else if (data.status === 404) {
          this.setState({
            message: 'エラー:条件に合致するデータはありません',
            messageColor: 'error'
          })
        } else {
          this.setState({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          })
        }
      }
    )
  }

  editQuiz = () => {
    post(
      '/edit',
      {
        file_num: this.state.edit_file_num,
        quiz_num: this.state.edit_quiz_num,
        question: this.state.edit_question,
        answer: this.state.edit_answer,
        category: this.state.edit_category,
        img_file: this.state.edit_image
      },
      (data: any) => {
        if (data.status === 200) {
          data = data.body
          this.setState({
            edit_file_num: -1,
            edit_quiz_num: -1,
            edit_question: '',
            edit_answer: '',
            edit_category: '',
            edit_image: '',
            message: 'Success!! 編集に成功しました',
            messageColor: 'initial'
          })
        } else {
          this.setState({
            message: 'エラー:外部APIとの連携に失敗しました',
            messageColor: 'error'
          })
        }
      }
    )
  }

  contents = () => {
    return (
      <Container>
        <h1>WAT Quizzer</h1>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography
              variant="h6"
              component="h6"
              color={this.state.messageColor}
            >
              {this.state.message}
            </Typography>
          </CardContent>
        </Card>

        <FormGroup>
          <FormControl>
            <InputLabel id="quiz-file-input">問題ファイル</InputLabel>
            <Select
              labelId="quiz-file-name"
              id="quiz-file-id"
              defaultValue={-1}
              // value={age}
              onChange={(e) => {
                this.setState({ file_num: Number(e.target.value) })
              }}
            >
              <MenuItem value={-1} key={-1}>
                選択なし
              </MenuItem>
              {this.state.filelistoption}
            </Select>
          </FormControl>

          <FormControl>
            <TextField
              label="問題番号"
              onChange={(e) => {
                this.setState({ quiz_num: Number(e.target.value) })
              }}
            />
          </FormControl>
        </FormGroup>

        <Button
          style={buttonStyle}
          variant="contained"
          color="primary"
          onClick={(e) => this.getQuiz()}
        >
          問題取得
        </Button>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              ファイル：
              {this.state.edit_file_num === -1 ? '' : this.state.edit_file_num}
            </Typography>

            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              問題番号：
              {this.state.edit_quiz_num === -1 ? '' : this.state.edit_quiz_num}
            </Typography>

            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              問題　　：
              <Input
                fullWidth
                maxRows={1}
                value={this.state.edit_question}
                onChange={(e) =>
                  this.setState({ edit_question: e.target.value })
                }
              />
            </Typography>

            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              答え　　：
              <Input
                fullWidth
                maxRows={1}
                value={this.state.edit_answer}
                onChange={(e) => this.setState({ edit_answer: e.target.value })}
              />
            </Typography>

            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              カテゴリ：
              <Input
                fullWidth
                maxRows={1}
                value={this.state.edit_category}
                onChange={(e) =>
                  this.setState({ edit_category: e.target.value })
                }
              />
            </Typography>

            <Typography variant="h6" component="h6" style={messageBoxStyle}>
              画像ファイル：
              <Input
                fullWidth
                maxRows={1}
                value={this.state.edit_image}
                onChange={(e) => this.setState({ edit_image: e.target.value })}
              />
            </Typography>
          </CardContent>
        </Card>

        <Button
          style={buttonStyle}
          variant="contained"
          color="primary"
          onClick={(e) => this.editQuiz()}
        >
          更新
        </Button>
      </Container>
    )
  }

  render() {
    return (
      <>
        <QuizzerLayout contents={this.contents()} />
      </>
    )
  }
}
