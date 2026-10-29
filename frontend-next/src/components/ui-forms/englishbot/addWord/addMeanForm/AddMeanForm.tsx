import {
  IconButton,
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
import type { AddWordAPIRequestDto, PullDownOptionDto } from 'quizzer-lib';
import { PULLDOWN_NONE_VALUE, PULLDOWN_OTHER_VALUE } from '@/constants/pullDown';
import { PullDownWithOther } from '@/components/ui-parts/pullDownWithOther/PullDownWithOther';
// TODO @mui/material はなくす

interface AddMeanFormProps {
  posList: PullDownOptionDto[];
  addWordState: AddWordAPIRequestDto;
  setAddWordState?: React.Dispatch<React.SetStateAction<AddWordAPIRequestDto>>;
}

export const AddMeanForm = ({ posList, addWordState, setAddWordState }: AddMeanFormProps) => {
  // 品詞プルダウン変更時の入力の更新
  const changePosSelect = (value: number, i: number) => {
    const copyMeanRowList = [...addWordState.meanArrayData];
    if (i >= copyMeanRowList.length) {
      while (i >= copyMeanRowList.length) {
        copyMeanRowList.push({
          partOfSpeechId: PULLDOWN_NONE_VALUE,
          meaning: ''
        });
      }
    }
    copyMeanRowList[i] = {
      partOfSpeechId: value,
      partOfSpeechName: value === PULLDOWN_OTHER_VALUE ? copyMeanRowList[i].partOfSpeechName : undefined,
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
          partOfSpeechId: PULLDOWN_NONE_VALUE,
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
      partOfSpeechId: PULLDOWN_NONE_VALUE,
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
                    <PullDownWithOther
                      label="品詞"
                      id={`pos-select-${index}`}
                      optionList={posList}
                      value={meanDto.partOfSpeechId}
                      otherValue={meanDto.partOfSpeechName}
                      onChange={(value) => changePosSelect(value, index)}
                      onOtherChange={(value) => inputPos(value, index)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      id={`meaning-${index}`}
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
        <IconButton aria-label="行追加" onClick={addTableRow}>
          <AddCircleOutlineIcon />
        </IconButton>
        <IconButton aria-label="行削除" onClick={decrementTableRow}>
          <RemoveCircleOutlineIcon />
        </IconButton>
      </Stack>
    </>
  );
};
