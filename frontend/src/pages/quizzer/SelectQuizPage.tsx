import React from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Checkbox,
  Container,
  Collapse,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  FormGroup,
  TextField,
  Typography,
  Slider
} from '@material-ui/core'

import { get, post } from '../../common/API'
import QuizzerLayout from './components/QuizzerLayout'
import { Button } from '@mui/material'

const buttonStyle = {
  margin: '10px'
}

const messageBoxStyle = {
  margin: '10px 0px 20px',
  borderStyle: 'none'
}

interface SelectQuizPageState {
  filelistoption: JSX.Element[]
  categorylistoption: JSX.Element[]
  file_num: number
  quiz_num: number
  quiz_sentense: string
  quiz_checked: boolean | null
  answer: string
  selected_category: string
  expanded: boolean
  value: number[] | number
  checked: boolean
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
}

export default class SelectQuizPage extends React.Component<
  {},
  SelectQuizPageState
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
    this.selectedFileChange = this.selectedFileChange.bind(this)
    this.rangeSlider = this.rangeSlider.bind(this)
    this.answerSection = this.answerSection.bind(this)
    this.getQuiz = this.getQuiz.bind(this)
    this.getRandomQuiz = this.getRandomQuiz.bind(this)
    this.getWorstRateQuiz = this.getWorstRateQuiz.bind(this)
    this.getMinimumClearQuiz = this.getMinimumClearQuiz.bind(this)
    this.state = {
      file_num: -1,
      expanded: false,
      value: [0, 100],
      checked: false,
      message: '　',
      messageColor: 'initial'
    } as SelectQuizPageState
  }

  rangeSlider = () => {
    const handleChange = (
      event: React.ChangeEvent<{}>,
      newValue: number[] | number
    ) => {
      this.setState({ value: newValue })
    }

    return (
      <>
        <Typography id="range-slider" gutterBottom>
          正解率(%)指定
        </Typography>
        <Slider
          value={this.state.value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
        />
      </>
    )
  }

  selectedFileChange = (e: any) => {
    post(
      '/get_category',
      {
        file_num: e.target.value
      },
      (data: any) => {
        if (data.status === 200) {
          data = data.body
          let categorylist = []
          for (var i = 0; i < data.length; i++) {
            categorylist.push(
              <MenuItem value={data[i].category} key={i}>
                {data[i].category}
              </MenuItem>
            )
          }
          this.setState({
            file_num: e.target.value,
            categorylistoption: categorylist
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
            quiz_sentense: data[0].quiz_sentense,
            answer: data[0].answer,
            quiz_checked: data[0].checked,
            expanded: false,
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

  answerSection = () => {
    const handleExpandClick = () => {
      this.setState({ expanded: !this.state.expanded })
    }

    const inputCorrect = () => {
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
      } else if (
        this.state.quiz_sentense === undefined ||
        this.state.quiz_sentense === null ||
        this.state.quiz_sentense === '' ||
        this.state.answer === undefined ||
        this.state.answer === null ||
        this.state.answer === ''
      ) {
        this.setState({
          message: 'エラー:問題を出題してから登録して下さい',
          messageColor: 'error'
        })
        return
      }

      post(
        '/correct',
        {
          file_num: this.state.file_num,
          quiz_num: this.state.quiz_num
        },
        (data: any) => {
          if (data.status === 200) {
            data = data.body
            this.setState({
              quiz_sentense: '',
              answer: '',
              quiz_checked: null,
              message: '問題[' + this.state.quiz_num + '] 正解+1! 登録しました',
              messageColor: 'initial',
              expanded: false
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

    const inputIncorrect = () => {
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
      } else if (
        this.state.quiz_sentense === undefined ||
        this.state.quiz_sentense === null ||
        this.state.quiz_sentense === '' ||
        this.state.answer === undefined ||
        this.state.answer === null ||
        this.state.answer === ''
      ) {
        this.setState({
          message: 'エラー:問題を出題してから登録して下さい',
          messageColor: 'error'
        })
        return
      }

      post(
        '/incorrect',
        {
          file_num: this.state.file_num,
          quiz_num: this.state.quiz_num
        },
        (data: any) => {
          if (data.status === 200) {
            data = data.body
            this.setState({
              quiz_sentense: '',
              answer: '',
              quiz_checked: null,
              message:
                '問題[' + this.state.quiz_num + '] 不正解+1.. 登録しました',
              messageColor: 'initial',
              expanded: false
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

    const checkReverseToQuiz = () => {
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
      } else if (
        this.state.quiz_sentense === undefined ||
        this.state.quiz_sentense === null ||
        this.state.quiz_sentense === '' ||
        this.state.answer === undefined ||
        this.state.answer === null ||
        this.state.answer === ''
      ) {
        this.setState({
          message: 'エラー:問題を出題してから登録して下さい',
          messageColor: 'error'
        })
        return
      }

      post(
        '/edit/check/reverse',
        {
          file_num: this.state.file_num,
          quiz_num: this.state.quiz_num
        },
        (data: any) => {
          if (data.status === 200) {
            data = data.body
            const message = `問題[${this.state.quiz_num}] にチェック${Boolean(data) ? "をつけ" : "を外し"}ました`
            this.setState({
              quiz_checked: Boolean(data),
              message,
              messageColor: 'initial',
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

    return (
      <>
        <CardActions>
          <Button
            size="small"
            onClick={handleExpandClick}
            aria-expanded={this.state.expanded}
          >
            答え
          </Button>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle1" component="h2">
              {this.state.answer}
            </Typography>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              onClick={inputCorrect}
            >
              正解!!
            </Button>
            <Button
              style={buttonStyle}
              variant="contained"
              color="secondary"
              onClick={inputIncorrect}
            >
              不正解..
            </Button>
            <Button
              style={buttonStyle}
              variant="contained"
              color="warning"
              onClick={checkReverseToQuiz}
            >
              チェックつける/外す
            </Button>
          </CardContent>
        </Collapse>
      </>
    )
  }

  getRandomQuiz = () => {
    if (this.state.file_num === -1) {
      this.setState({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error'
      })
      return
    }
    post(
      '/random',
      {
        file_num: this.state.file_num,
        min_rate: Array.isArray(this.state.value)
          ? this.state.value[0]
          : this.state.value,
        max_rate: Array.isArray(this.state.value)
          ? this.state.value[1]
          : this.state.value,
        category:
          this.state.selected_category === ''
            ? null
            : this.state.selected_category,
        checked: this.state.checked
      },
      (data: any) => {
        if (data.status === 200) {
          data = data.body
          this.setState({
            quiz_num: data[0].quiz_num,
            quiz_sentense: data[0].quiz_sentense,
            answer: data[0].answer,
            quiz_checked: data[0].checked,
            expanded: false,
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

  getWorstRateQuiz = () => {
    if (this.state.file_num === -1) {
      this.setState({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error'
      })
      return
    }
    post(
      '/worst_rate',
      {
        file_num: this.state.file_num,
        category:
          this.state.selected_category === ''
            ? null
            : this.state.selected_category,
        checked: this.state.checked
      },
      (data: any) => {
        if (data.status === 200) {
          data = data.body
          this.setState({
            quiz_num: data[0].quiz_num,
            quiz_sentense: data[0].quiz_sentense,
            answer: data[0].answer,
            quiz_checked: data[0].checked,
            expanded: false,
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

  getMinimumClearQuiz = () => {
    if (this.state.file_num === -1) {
      this.setState({
        message: 'エラー:問題ファイルを選択して下さい',
        messageColor: 'error'
      })
      return
    }
    post(
      '/minimum_clear',
      {
        file_num: this.state.file_num,
        category:
          this.state.selected_category === ''
            ? null
            : this.state.selected_category,
        checked: this.state.checked
      },
      (data: any) => {
        if (data.status === 200) {
          data = data.body
          this.setState({
            quiz_num: data[0].quiz_num,
            quiz_sentense: data[0].quiz_sentense,
            answer: data[0].answer,
            quiz_checked: data[0].checked,
            expanded: false,
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
              onChange={(e) => this.selectedFileChange(e)}
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

          <FormControl>
            <InputLabel id="demo-simple-select-label">カテゴリ</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={''}
              // value={age}
              onChange={(e) => {
                this.setState({ selected_category: String(e.target.value) })
              }}
            >
              <MenuItem value={-1}>選択なし</MenuItem>
              {this.state.categorylistoption}
            </Select>
          </FormControl>

          <FormControl>{this.rangeSlider()}</FormControl>

          <FormControl>
            <FormControlLabel
              value="only-checked"
              control={
                <Checkbox
                  color="primary"
                  onChange={(e) => this.setState({ checked: e.target.checked })}
                />
              }
              label="チェック済から出題"
              labelPlacement="start"
            />
          </FormControl>
        </FormGroup>

        <Button
          style={buttonStyle}
          variant="contained"
          color="primary"
          onClick={(e) => this.getQuiz()}
        >
          出題
        </Button>
        <Button
          style={buttonStyle}
          variant="contained"
          color="secondary"
          onClick={(e) => this.getRandomQuiz()}
        >
          ランダム出題
        </Button>
        <Button
          style={buttonStyle}
          variant="contained"
          color="secondary"
          onClick={(e) => this.getWorstRateQuiz()}
        >
          最低正解率問出題
        </Button>
        <Button
          style={buttonStyle}
          variant="contained"
          color="secondary"
          onClick={(e) => this.getMinimumClearQuiz()}
        >
          最小正解数問出題
        </Button>
        <Button
          style={buttonStyle}
          variant="contained"
          color="info"
          disabled
        >
          画像表示
        </Button>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h2">
              問題
            </Typography>
            <Typography variant="subtitle1" component="h2">
              {this.state.quiz_checked ? "✅" : ""}{this.state.quiz_sentense}
            </Typography>
          </CardContent>
          {this.answerSection()}
        </Card>
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
