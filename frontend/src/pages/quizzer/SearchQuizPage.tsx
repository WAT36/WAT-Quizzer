import React, { useEffect, useState } from 'react'

import { DataGrid, GridRowsProp, GridSelectionModel } from '@mui/x-data-grid'

import { get, post } from '../../common/API'
import QuizzerLayout from './components/QuizzerLayout'
import {
  buttonStyle,
  groupStyle,
  messageBoxStyle,
  searchedTableStyle
} from '../../styles/Pages'
import { messageColorType } from '../../interfaces/MessageColorType'
import { columns } from './utils/SearchTable'
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography
} from '@mui/material'

export default function SearchQuizPage() {
  const [file_num, setFileNum] = useState<number>(-1)
  const [value, setValue] = useState<number[] | number>([0, 100])
  const [checked, setChecked] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('　')
  const [messageColor, setMessageColor] = useState<messageColorType>('initial')
  const [searchResult, setSearchResult] = useState<GridRowsProp>(
    [] as GridRowsProp
  )
  const [query, setQuery] = useState<string>()
  const [selected_category, setSelectedCategory] = useState<string>()
  const [cond_question, setCondQuestion] = useState<boolean>()
  const [cond_answer, setCondAnswer] = useState<boolean>()
  const [filelistoption, setFilelistoption] = useState<JSX.Element[]>()
  const [categorylistoption, setCategorylistoption] = useState<JSX.Element[]>()
  const [checkedIdList, setCheckedIdList] = useState<number[]>([] as number[])
  const [changedCategory, setChangedCategory] = useState<string>('')

  useEffect(() => {
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
        setFilelistoption(filelist)
      } else {
        setMessage('エラー:外部APIとの連携に失敗しました')
        setMessageColor('error')
      }
    })
  })

  const selectedFileChange = (e: any) => {
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
          setFileNum(e.target.value)
          setCategorylistoption(categorylist)
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました')
          setMessageColor('error')
        }
      }
    )
  }

  const rangeSlider = () => {
    const handleChange = (event: Event, newValue: number[] | number) => {
      setValue(newValue)
    }

    return (
      <>
        <Typography id="range-slider" gutterBottom>
          正解率(%)指定
        </Typography>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
        />
      </>
    )
  }

  const searchQuiz = () => {
    if (file_num === -1) {
      setMessage('エラー:問題ファイルを選択して下さい')
      setMessageColor('error')
      return
    }

    post(
      '/search',
      {
        file_num: file_num,
        query: query || '',
        category: selected_category === '' ? null : selected_category,
        min_rate: Array.isArray(value) ? value[0] : value,
        max_rate: Array.isArray(value) ? value[1] : value,
        cond: {
          question: cond_question,
          answer: cond_answer
        },
        checked: checked
      },
      (data: any) => {
        if (data.status === 200) {
          data = data.body
          setSearchResult(data)
          setMessage('　')
          setMessageColor('initial')
        } else if (data.status === 404) {
          setMessage('エラー:条件に合致するデータはありません')
          setMessageColor('error')
        } else {
          setMessage('エラー:外部APIとの連携に失敗しました')
          setMessageColor('error')
        }
      }
    )
  }

  // チェックした問題のIDをステートに登録
  const registerCheckedIdList = (
    selectionModel: GridSelectionModel,
    details?: any
  ) => {
    setCheckedIdList(selectionModel as number[])
  }

  // チェックした問題に指定カテゴリを一括登録する
  const registerCategoryToChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage('エラー:チェックされた問題がありません')
      setMessageColor('error')
      return
    } else if (changedCategory === '') {
      setMessage('エラー:一括登録するカテゴリ名を入力して下さい')
      setMessageColor('error')
      return
    }

    // チェックした問題にカテゴリを登録
    const addCategoriesToQuiz = async (idList: number[]) => {
      const failureIdList: number[] = []
      for (const checkedId of idList) {
        await post(
          '/edit/category/add',
          {
            file_num: file_num,
            quiz_num: checkedId,
            category: changedCategory
          },
          (data: any) => {
            if (data.status !== 200) {
              failureIdList.push(checkedId)
            }
          }
        )
      }
      return { failureIdList }
    }
    const { failureIdList } = await addCategoriesToQuiz(checkedIdList)

    let message: string
    let messageColor: 'error' | 'initial'
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]へのカテゴリ登録に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件登録成功）`
      messageColor = 'error'
    } else {
      message = `チェック問題(${checkedIdList.length}件)へのカテゴリ登録に成功しました`
      messageColor = 'initial'
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([])
    setChangedCategory('')
    setMessage(message)
    setMessageColor(messageColor)
  }

  // チェックした問題から指定カテゴリを一括削除する
  const removeCategoryFromChecked = async () => {
    if (checkedIdList.length === 0) {
      setMessage('エラー:チェックされた問題がありません')
      setMessageColor('error')
      return
    } else if (changedCategory === '') {
      setMessage('エラー:一括削除するカテゴリ名を入力して下さい')
      setMessageColor('error')
      return
    }

    // チェックした問題からカテゴリを削除
    const removeCategories = async (idList: number[]) => {
      const failureIdList: number[] = []
      for (const checkedId of idList) {
        await post(
          '/edit/category/remove',
          {
            file_num: file_num,
            quiz_num: checkedId,
            category: changedCategory
          },
          (data: any) => {
            if (data.status !== 200) {
              failureIdList.push(checkedId)
            }
          }
        )
      }
      return { failureIdList }
    }
    const { failureIdList } = await removeCategories(checkedIdList)

    let message: string
    let messageColor: 'error' | 'initial'
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]のカテゴリ削除に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件削除成功）`
      messageColor = 'error'
    } else {
      message = `チェック問題(${checkedIdList.length}件)のカテゴリ削除に成功しました`
      messageColor = 'initial'
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([])
    setChangedCategory('')
    setMessage(message)
    setMessageColor(messageColor)
  }

  // 選択した問題全てにチェックをつける
  const checkedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage('エラー:選択された問題がありません')
      setMessageColor('error')
      return
    }

    // 選択した問題にチェック
    const checkToQuiz = async (idList: number[]) => {
      const failureIdList: number[] = []
      for (const checkedId of idList) {
        await post(
          '/edit/check',
          {
            file_num: file_num,
            quiz_num: checkedId
          },
          (data: any) => {
            if (data.status !== 200) {
              failureIdList.push(checkedId)
            }
          }
        )
      }
      return { failureIdList }
    }
    const { failureIdList } = await checkToQuiz(checkedIdList)

    let message: string
    let messageColor: 'error' | 'initial'
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]へのチェック登録に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件登録成功）`
      messageColor = 'error'
    } else {
      message = `選択した問題(${checkedIdList.length}件)へのチェック登録に成功しました`
      messageColor = 'initial'
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([])
    setChangedCategory('')
    setMessage(message)
    setMessageColor(messageColor)
  }

  // 選択した問題全てにチェックを外す
  const uncheckedToSelectedQuiz = async () => {
    if (checkedIdList.length === 0) {
      setMessage('エラー:選択された問題がありません')
      setMessageColor('error')
      return
    }

    // 選択した問題にチェック
    const uncheckToQuiz = async (idList: number[]) => {
      const failureIdList: number[] = []
      for (const checkedId of idList) {
        await post(
          '/edit/uncheck',
          {
            file_num: file_num,
            quiz_num: checkedId
          },
          (data: any) => {
            if (data.status !== 200) {
              failureIdList.push(checkedId)
            }
          }
        )
      }
      return { failureIdList }
    }
    const { failureIdList } = await uncheckToQuiz(checkedIdList)

    let message: string
    let messageColor: 'error' | 'initial'
    if (failureIdList.length > 0) {
      message = `エラー:問題ID[${failureIdList.join()}]へのチェック削除に失敗しました（${
        checkedIdList.length - failureIdList.length
      }/${checkedIdList.length}件削除成功）`
      messageColor = 'error'
    } else {
      message = `選択した問題(${checkedIdList.length}件)へのチェック削除に成功しました`
      messageColor = 'initial'
    }

    // 終わったらチェック全て外す、入力カテゴリも消す
    setCheckedIdList([])
    setChangedCategory('')
    setMessage(message)
    setMessageColor(messageColor)
  }

  const contents = () => {
    return (
      <Container>
        <h1>WAT Quizzer</h1>

        <Card variant="outlined" style={messageBoxStyle}>
          <CardContent>
            <Typography variant="h6" component="h6" color={messageColor}>
              {message}
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
              onChange={(e) => selectedFileChange(e)}
            >
              <MenuItem value={-1} key={-1}>
                選択なし
              </MenuItem>
              {filelistoption}
            </Select>
          </FormControl>

          <FormControl>
            <TextField
              label="検索語句"
              onChange={(e) => {
                setQuery(e.target.value)
              }}
            />
          </FormControl>

          <FormGroup row>
            検索対象：
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    setCondQuestion(e.target.checked)
                  }}
                  name="checkedA"
                />
              }
              label="問題"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    setCondAnswer(e.target.checked)
                  }}
                  name="checkedB"
                />
              }
              label="答え"
            />
          </FormGroup>

          <FormControl>
            <InputLabel id="demo-simple-select-label">カテゴリ</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={-1}
              // value={age}
              onChange={(e) => {
                setSelectedCategory(String(e.target.value))
              }}
            >
              <MenuItem value={-1}>選択なし</MenuItem>
              {categorylistoption}
            </Select>
          </FormControl>

          <FormControl>{rangeSlider()}</FormControl>

          <FormControl>
            <FormControlLabel
              value="only-checked"
              control={
                <Checkbox
                  color="primary"
                  onChange={(e) => setChecked(e.target.checked)}
                />
              }
              label="チェック済のみ検索"
              labelPlacement="start"
            />
          </FormControl>
        </FormGroup>

        <Button
          style={buttonStyle}
          variant="contained"
          color="primary"
          onClick={(e) => searchQuiz()}
        >
          検索
        </Button>

        <div style={searchedTableStyle}>
          <DataGrid
            rows={searchResult}
            columns={columns}
            pageSize={15}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(selectionModel, details) =>
              registerCheckedIdList(selectionModel, details)
            }
          />
        </div>

        <FormGroup style={groupStyle} row>
          チェックした問題全てにカテゴリ「
          <FormControl>
            <TextField
              id="change-category"
              value={changedCategory}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => setChangedCategory(e.target.value)}
            />
          </FormControl>
          」を
          <FormControl>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              onClick={async (e) => await registerCategoryToChecked()}
            >
              一括カテゴリ登録
            </Button>
          </FormControl>
          or
          <FormControl>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              onClick={async (e) => await removeCategoryFromChecked()}
            >
              一括カテゴリ削除
            </Button>
          </FormControl>
        </FormGroup>

        <FormGroup style={groupStyle} row>
          チェックした問題全てに
          <FormControl>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              onClick={async (e) => await checkedToSelectedQuiz()}
            >
              ✅をつける
            </Button>
          </FormControl>
          or
          <FormControl>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              onClick={async (e) => await uncheckedToSelectedQuiz()}
            >
              ✅を外す
            </Button>
          </FormControl>
        </FormGroup>
      </Container>
    )
  }

  return (
    <>
      <QuizzerLayout contents={contents()} />
    </>
  )
}
