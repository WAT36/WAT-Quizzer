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
import { MessageState, PullDownOptionState } from '../../../../../../interfaces/state';
import { meanOfAddWordDto } from '../../../../../../interfaces/api/response';

interface AddMeanFormProps {
  posList: PullDownOptionState[];
  sourceList: PullDownOptionState[];
  meanRowList: meanOfAddWordDto[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setMeanRowList?: React.Dispatch<React.SetStateAction<meanOfAddWordDto[]>>;
}

export const AddMeanForm = ({ posList, sourceList, meanRowList, setMessage, setMeanRowList }: AddMeanFormProps) => {
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
          source: {
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
      source: copyMeanRowList[i].source,
      mean: copyMeanRowList[i].mean
    };
    setMeanRowList && setMeanRowList(copyMeanRowList);
  };

  // 出典プルダウン変更時の入力の更新
  const changeSourceSelect = (value: string, i: number) => {
    const copyMeanRowList = [...meanRowList];
    if (i >= copyMeanRowList.length) {
      while (i >= copyMeanRowList.length) {
        copyMeanRowList.push({
          pos: {
            id: -1
          },
          source: {
            id: -1
          },
          mean: undefined
        });
      }
    }
    copyMeanRowList[i] = {
      pos: copyMeanRowList[i].pos,
      source: {
        id: Number(value),
        name: Number(value) === -2 ? copyMeanRowList[i].source.name : undefined
      },
      mean: copyMeanRowList[i].mean
    };
    setMeanRowList && setMeanRowList(copyMeanRowList);
  };

  // 出典プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displaySourceInput = (i: number) => {
    const sourceInput =
      meanRowList[i] && meanRowList[i].source.id === -2 ? (
        <>
          <TextField
            id="input-pos-01"
            label="出典"
            variant="outlined"
            key={i}
            sx={{ width: 1 }}
            onChange={(e) => {
              inputSource(e.target.value, i);
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
          label="source"
          key={i}
          sx={{ width: 1 }}
          onChange={(e) => {
            changeSourceSelect(String(e.target.value), i);
          }}
        >
          <MenuItem value={-1} key={-1}>
            選択なし
          </MenuItem>
          {sourceList.map((x) => (
            <MenuItem value={x.value} key={x.value}>
              {x.label}
            </MenuItem>
          ))}
        </Select>
        {sourceInput}
      </>
    );
  };

  // 品詞入力時の処理
  const inputPos = (value: string, i: number) => {
    const copyMeanRowList = [...meanRowList];
    copyMeanRowList[i] = {
      pos: {
        id: copyMeanRowList[i].pos.id,
        name: value
      },
      source: copyMeanRowList[i].source,
      mean: copyMeanRowList[i].mean
    };
    setMeanRowList && setMeanRowList(copyMeanRowList);
  };

  // 出典入力時の処理
  const inputSource = (value: string, i: number) => {
    const copyMeanRowList = [...meanRowList];
    copyMeanRowList[i] = {
      pos: copyMeanRowList[i].pos,
      source: {
        id: copyMeanRowList[i].source.id,
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
          source: {
            id: -1
          },
          mean: undefined
        });
      }
    }
    copyMeanRowList[i] = {
      pos: copyMeanRowList[i].pos,
      source: copyMeanRowList[i].source,
      mean: value
    };
    setMeanRowList && setMeanRowList(copyMeanRowList);
  };

  // 列をステートに追加
  const setTableRow = () => {
    const copyMeanRowList = [...meanRowList];
    copyMeanRowList.push({
      pos: {
        id: -1,
        name: undefined
      },
      source: {
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

  // 列を追加
  const addRow = () => {
    setTableRow();
  };

  // 列を削除
  const decrementRow = () => {
    decrementTableRow();
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 200 }}>{'品詞'}</TableCell>
              <TableCell sx={{ width: 200 }}>{'出典'}</TableCell>
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
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                    {displaySourceInput(index)}
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
        <IconButton onClick={addRow}>
          <AddCircleOutlineIcon />
        </IconButton>
        <IconButton onClick={decrementRow}>
          <RemoveCircleOutlineIcon />
        </IconButton>
      </Stack>
    </>
  );
};
