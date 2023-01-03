import React from 'react'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import FormGroup from '@mui/material/FormGroup'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Button from '@mui/material/Button'

import EnglishBotLayout from '../components/EnglishBotLayout'
import { get, post } from '../../../common/API'
import { messageBoxStyle, buttonStyle } from '../../../styles/Pages'

interface AddWordPageState {
  message: string
  messageColor: string
  posList: JSX.Element[]
  rowList: JSX.Element[]
  inputWord: string
}

interface SendToAddWordApiData {
  partOfSpeechId: number
  meaning: string
}

class EnglishBotAddWordPage extends React.Component<{}, AddWordPageState> {
  posListOption: JSX.Element[] = []
  tableRows: JSX.Element[] = []
  inputMeans: [number, string][] = []

  constructor(props: any) {
    super(props)
    this.getPartOfSpeechList = this.getPartOfSpeechList.bind(this)
    this.getTableRow = this.getTableRow.bind(this)
    this.setTableRow = this.setTableRow.bind(this)
    this.addRow = this.addRow.bind(this)
    this.displayRow = this.displayRow.bind(this)
    this.changeSelect = this.changeSelect.bind(this)
    this.inputWordName = this.inputWordName.bind(this)
    this.addWord = this.addWord.bind(this)

    this.state = {
      message: '　',
      messageColor: 'initial',
      posList: this.posListOption,
      rowList: this.tableRows,
      inputWord: ''
    } as AddWordPageState
  }

  componentDidMount() {
    this.getPartOfSpeechList()
  }

  messeageClear() {
    this.setState({
      message: '　',
      messageColor: 'initial'
    })
  }

  getPartOfSpeechList = () => {
    get('/english/partsofspeech', (data: any) => {
      if (data.status === 200) {
        data = data.body
        let posList = []
        for (var i = 0; i < data.length; i++) {
          posList.push(
            <MenuItem value={data[i].id} key={data[i].id}>
              {data[i].name}
            </MenuItem>
          )
        }
        this.posListOption = posList
        this.setState({
          posList: this.posListOption
        })
      } else {
        this.setState({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error'
        })
      }
    })
  }

  setTableRow = () => {
    this.tableRows.push(this.getTableRow(this.tableRows.length))
    this.inputMeans.push([-1, ''])
    this.setState({
      rowList: this.tableRows
    })
  }

  getTableRow = (i: number) => {
    return (
      <TableRow>
        <TableCell>
          <InputLabel id="demo-simple-select-label"></InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue={-1}
            label="partOfSpeech"
            key={i}
            sx={{ width: 1 }}
            onChange={(e) => {
              this.changeSelect(String(e.target.value), i, false)
            }}
          >
            <MenuItem value={-1} key={-1}>
              選択なし
            </MenuItem>
            {this.state.posList}
          </Select>
        </TableCell>
        <TableCell>
          <TextField
            id="input-mean-01"
            label="意味"
            variant="outlined"
            key={i}
            sx={{ width: 1 }}
            onChange={(e) => {
              this.changeSelect(e.target.value, i, true)
            }}
          />
        </TableCell>
      </TableRow>
    )
  }

  addRow = () => {
    this.messeageClear()
    this.setTableRow()
  }

  displayRow = () => {
    return this.tableRows.map((value) => {
      return value
    })
  }

  changeSelect = (value: string, i: number, isMean: boolean) => {
    if (i + 1 <= this.inputMeans.length) {
      this.inputMeans[i] = isMean
        ? [this.inputMeans[i][0], value]
        : [Number(value), this.inputMeans[i][1]]
    } else {
      while (i >= this.inputMeans.length) {
        this.inputMeans.push([-1, ''])
      }
      this.inputMeans[i] = [-1, '']
    }
  }

  inputWordName = (value: string) => {
    this.messeageClear()
    this.setState({
      inputWord: value
    })
  }

  addWord = () => {
    if (this.state.inputWord === '') {
      this.setState({
        message: 'エラー:単語が入力されておりません',
        messageColor: 'error'
      })
      return
    }

    for (let i = 0; i < this.inputMeans.length; i++) {
      if (this.inputMeans[i][0] === -1) {
        this.setState({
          message: `エラー:${i + 1}行目の品詞を入力してください`,
          messageColor: 'error'
        })
        return
      } else if (this.inputMeans[i][1] === '') {
        this.setState({
          message: `エラー:${i + 1}行目の意味を入力してください`,
          messageColor: 'error'
        })
        return
      }
    }

    post(
      '/english/word/add',
      {
        wordName: this.state.inputWord,
        pronounce: '',
        meanArrayData: this.inputMeans.reduce(
          (previousValue: SendToAddWordApiData[], currentValue) => {
            if (currentValue[0] >= 0) {
              previousValue.push({
                partOfSpeechId: currentValue[0],
                meaning: currentValue[1]
              })
            }
            return previousValue
          },
          []
        )
      },
      (data: any) => {
        console.log('data:', data)
        if (data.status === 200) {
          this.setState({
            message: `単語「${this.state.inputWord}」を登録しました`,
            messageColor: 'initial',
            inputWord: ''
          })
          this.tableRows = []
          this.inputMeans = []
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
        <h1>Add Word</h1>

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

        <Button variant="contained" style={buttonStyle} onClick={this.addWord}>
          登録
        </Button>
        <FormGroup>
          <FormControl>
            <TextField
              fullWidth
              label="New Word"
              id="newWord"
              value={this.state.inputWord}
              onChange={(e) => this.inputWordName(e.target.value)}
            />
          </FormControl>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 200 }}>{'品詞'}</TableCell>
                  <TableCell>{'意味'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.displayRow()}</TableBody>
            </Table>
          </TableContainer>
          <IconButton
            aria-label="delete"
            sx={{ margin: 'auto' }}
            onClick={this.addRow}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </FormGroup>
      </Container>
    )
  }

  render() {
    return (
      <>
        <EnglishBotLayout contents={this.contents()} />
      </>
    )
  }
}

export default EnglishBotAddWordPage
