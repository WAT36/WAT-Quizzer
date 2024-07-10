import {
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { PullDownOptionState } from '../../../../../../interfaces/state';
import { AddWordAPIRequestDto } from 'quizzer-lib';
// TODO @mui/material はなくす

interface AddMeanFormProps {
  posList: PullDownOptionState[];
  addWordState: AddWordAPIRequestDto;
  setAddWordState?: React.Dispatch<React.SetStateAction<AddWordAPIRequestDto>>;
}

export const AddMeanForm = ({ posList, addWordState, setAddWordState }: AddMeanFormProps) => {
  // 品詞プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displayPosInput = (i: number) => {
    const posInput =
      addWordState.meanArrayData[i] && addWordState.meanArrayData[i].partOfSpeechId === -2 ? (
        <>
          <TextField
            id="input-pos-01"
            label="品詞"
            variant="outlined"
            key={i}
            sx={{ width: 1 }}
            onChange={(e) => {
              inputPos(e.target.value, i);
            }}
          />
        </>
      ) : (
        <></>
      );

    return (
      <>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue={-1}
          label="partOfSpeech"
          key={i}
          sx={{ width: 1 }}
          onChange={(e) => {
            changePosSelect(String(e.target.value), i);
          }}
        >
          <MenuItem value={-1} key={-1}>
            選択なし
          </MenuItem>
          {posList.map((x) => (
            <MenuItem value={x.value} key={x.value}>
              {x.label}
            </MenuItem>
          ))}
        </Select>
        {posInput}
      </>
    );
  };

  // 品詞プルダウン変更時の入力の更新
  const changePosSelect = (value: string, i: number) => {
    const copyMeanRowList = [...addWordState.meanArrayData];
    if (i >= copyMeanRowList.length) {
      while (i >= copyMeanRowList.length) {
        copyMeanRowList.push({
          partOfSpeechId: -1,
          meaning: ''
        });
      }
    }
    copyMeanRowList[i] = {
      partOfSpeechId: Number(value),
      partOfSpeechName: Number(value) === -2 ? copyMeanRowList[i].partOfSpeechName : undefined,
      meaning: copyMeanRowList[i].meaning
    };
    setAddWordState &&
      setAddWordState({
        ...addWordState,
        meanArrayData: copyMeanRowList
      });
  };

  // 品詞入力時の処理
  const inputPos = (value: string, i: number) => {
    const copyMeanRowList = [...addWordState.meanArrayData];
    copyMeanRowList[i] = {
      partOfSpeechId: copyMeanRowList[i].partOfSpeechId,
      partOfSpeechName: value,
      meaning: copyMeanRowList[i].meaning
    };
    setAddWordState &&
      setAddWordState({
        ...addWordState,
        meanArrayData: copyMeanRowList
      });
  };

  // 単語の意味入力時の更新
  const inputMean = (value: string, i: number) => {
    const copyMeanRowList = [...addWordState.meanArrayData];
    if (i >= copyMeanRowList.length) {
      while (i >= copyMeanRowList.length) {
        copyMeanRowList.push({
          partOfSpeechId: -1,
          meaning: ''
        });
      }
    }
    copyMeanRowList[i] = {
      partOfSpeechId: copyMeanRowList[i].partOfSpeechId,
      partOfSpeechName: copyMeanRowList[i].partOfSpeechName,
      meaning: value
    };
    setAddWordState &&
      setAddWordState({
        ...addWordState,
        meanArrayData: copyMeanRowList
      });
  };

  // 列を(ステートに)追加
  const addTableRow = () => {
    const copyMeanRowList = [...addWordState.meanArrayData];
    copyMeanRowList.push({
      partOfSpeechId: -1,
      partOfSpeechName: undefined,
      meaning: ''
    });
    setAddWordState &&
      setAddWordState({
        ...addWordState,
        meanArrayData: copyMeanRowList
      });
  };

  // 最終列を削除
  const decrementTableRow = () => {
    const copyMeanRowList = [...addWordState.meanArrayData];
    copyMeanRowList.pop();
    setAddWordState &&
      setAddWordState({
        ...addWordState,
        meanArrayData: copyMeanRowList
      });
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 200 }}>{'品詞'}</TableCell>
              <TableCell>{'意味'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addWordState.meanArrayData.map((meanDto, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                    {displayPosInput(index)}
                  </TableCell>
                  <TableCell>
                    <TextField
                      id="input-mean-01"
                      label="意味"
                      variant="outlined"
                      key={index}
                      sx={{ width: 1 }}
                      onChange={(e) => {
                        inputMean(e.target.value, index);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
        <IconButton onClick={addTableRow}>
          <AddCircleOutlineIcon />
        </IconButton>
        <IconButton onClick={decrementTableRow}>
          <RemoveCircleOutlineIcon />
        </IconButton>
      </Stack>
    </>
  );
};
