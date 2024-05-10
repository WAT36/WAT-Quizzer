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
import { meanOfAddWordDto } from 'quizzer-lib';

interface AddMeanFormProps {
  posList: PullDownOptionState[];
  sourceList: PullDownOptionState[];
  meanRowList: meanOfAddWordDto[];
  setMeanRowList?: React.Dispatch<React.SetStateAction<meanOfAddWordDto[]>>;
}

export const AddMeanForm = ({ posList, sourceList, meanRowList, setMeanRowList }: AddMeanFormProps) => {
  // 品詞プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displayPosInput = (i: number) => {
    const posInput =
      meanRowList[i] && meanRowList[i].pos.id === -2 ? (
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
    const copyMeanRowList = [...meanRowList];
    if (i >= copyMeanRowList.length) {
      while (i >= copyMeanRowList.length) {
        copyMeanRowList.push({
          pos: {
            id: -1
          },
          mean: undefined
        });
      }
    }
    copyMeanRowList[i] = {
      pos: {
        id: Number(value),
        name: Number(value) === -2 ? copyMeanRowList[i].pos.name : undefined
      },
      mean: copyMeanRowList[i].mean
    };
    setMeanRowList && setMeanRowList(copyMeanRowList);
  };

  // 品詞入力時の処理
  const inputPos = (value: string, i: number) => {
    const copyMeanRowList = [...meanRowList];
    copyMeanRowList[i] = {
      pos: {
        id: copyMeanRowList[i].pos.id,
        name: value
      },
      mean: copyMeanRowList[i].mean
    };
    setMeanRowList && setMeanRowList(copyMeanRowList);
  };

  // 単語の意味入力時の更新
  const inputMean = (value: string, i: number) => {
    const copyMeanRowList = [...meanRowList];
    if (i >= copyMeanRowList.length) {
      while (i >= copyMeanRowList.length) {
        copyMeanRowList.push({
          pos: {
            id: -1
          },
          mean: undefined
        });
      }
    }
    copyMeanRowList[i] = {
      pos: copyMeanRowList[i].pos,
      mean: value
    };
    setMeanRowList && setMeanRowList(copyMeanRowList);
  };

  // 列を(ステートに)追加
  const addTableRow = () => {
    const copyMeanRowList = [...meanRowList];
    copyMeanRowList.push({
      pos: {
        id: -1,
        name: undefined
      },
      mean: undefined
    });
    setMeanRowList && setMeanRowList(copyMeanRowList);
  };

  // 最終列を削除
  const decrementTableRow = () => {
    const copyMeanRowList = [...meanRowList];
    copyMeanRowList.pop();
    setMeanRowList && setMeanRowList(copyMeanRowList);
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
            {meanRowList.map((meanDto, index) => {
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
