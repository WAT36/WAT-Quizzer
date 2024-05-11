import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { InputAddWordState, PullDownOptionState } from '../../../../../../interfaces/state';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Card } from '@/components/ui-elements/card/Card';

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
          <InputLabel id="demo-simple-select-label"></InputLabel>
          <TextField
            label="出典"
            variant="outlined"
            setStater={(value: string) => {
              setInputWord &&
                setInputWord({
                  ...inputWord,
                  newSourceName: value
                });
            }}
            id="input-pos-01"
            key="addWordInputSource"
            className={['fullWidth', 'textField']}
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
          <MenuItem value={-2} key={-2}>
            その他
          </MenuItem>
        </Select>
        {sourceInput}
      </>
    );
  };

  return (
    <>
      <Card variant={'outlined'} attr={'padding'}>
        <TextField
          className={['fullWidth', 'textField']}
          label="New Word"
          id="newWord"
          value={inputWord.wordName}
          setStater={(value: string) => {
            setInputWord &&
              setInputWord({
                ...inputWord,
                wordName: value
              });
          }}
        />
        {displaySourceInput()}
        <TextField
          className={['fullWidth', 'textField']}
          label="サブ出典"
          id="subSource"
          value={inputWord.subSourceName}
          setStater={(value: string) => {
            setInputWord &&
              setInputWord({
                ...inputWord,
                subSourceName: value
              });
          }}
        />
      </Card>
    </>
  );
};
