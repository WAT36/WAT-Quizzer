import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { InputAddWordState, PullDownOptionState } from '../../../../../../interfaces/state';

interface InputAddWordFormProps {
  inputWord: InputAddWordState;
  sourceList: PullDownOptionState[];
  setInputWord?: React.Dispatch<React.SetStateAction<InputAddWordState>>;
}

export const InputAddWordForm = ({ inputWord, sourceList, setInputWord }: InputAddWordFormProps) => {
  // 出典プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displaySourceInput = () => {
    const sourceInput =
      inputWord.sourceId === -2 ? (
        <>
          <TextField
            id="input-pos-01"
            label="出典"
            variant="outlined"
            key="addWordInputSource"
            sx={{ width: 1 }}
            onChange={(e) => {
              setInputWord &&
                setInputWord({
                  ...inputWord,
                  newSourceName: e.target.value
                });
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
          key="source"
          sx={{ width: 1 }}
          onChange={(e) => {
            setInputWord &&
              setInputWord({
                ...inputWord,
                sourceId: +e.target.value
              });
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

  return (
    <>
      <FormControl>
        <TextField
          fullWidth
          label="New Word"
          id="newWord"
          value={inputWord.wordName}
          onChange={(e) =>
            setInputWord &&
            setInputWord({
              ...inputWord,
              wordName: e.target.value
            })
          }
        />
        <InputLabel id="demo-simple-select-label"></InputLabel>
        {displaySourceInput()}
        <TextField
          fullWidth
          label="サブ出典"
          id="subSource"
          value={inputWord.subSourceName}
          onChange={(e) =>
            setInputWord &&
            setInputWord({
              ...inputWord,
              subSourceName: e.target.value
            })
          }
        />
      </FormControl>
    </>
  );
};
