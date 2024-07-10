import { InputLabel, MenuItem, Select } from '@mui/material';
import { MessageState, PullDownOptionState } from '../../../../../../interfaces/state';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';

import { addWordAPI, AddWordAPIRequestDto, Message } from 'quizzer-lib';

interface InputAddWordFormProps {
  sourceList: PullDownOptionState[];
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  addWordState: AddWordAPIRequestDto;
  setAddWordState?: React.Dispatch<React.SetStateAction<AddWordAPIRequestDto>>;
}

export const InputAddWordForm = ({ sourceList, addWordState, setMessage, setAddWordState }: InputAddWordFormProps) => {
  // 出典プルダウン表示、「その他」だったら入力用テキストボックスを出す
  const displaySourceInput = () => {
    const sourceInput =
      addWordState.inputWord.sourceId === -2 ? (
        <>
          <InputLabel id="demo-simple-select-label"></InputLabel>
          <TextField
            label="出典"
            variant="outlined"
            setStater={(value: string) => {
              setAddWordState &&
                setAddWordState({
                  ...addWordState,
                  inputWord: {
                    ...addWordState.inputWord,
                    newSourceName: value
                  }
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
            setAddWordState &&
              setAddWordState({
                ...addWordState,
                inputWord: {
                  ...addWordState.inputWord,
                  sourceId: +e.target.value
                }
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
      <Button
        label="登録"
        variant="contained"
        attr="button-array"
        onClick={async (e) => {
          setMessage &&
            setMessage({
              message: '通信中...',
              messageColor: '#d3d3d3',
              isDisplay: true
            });
          const message: Message = await addWordAPI({ addWordData: addWordState });
          setMessage && setMessage(message);
          // TODO 成功時の条件
          if (message.messageColor === 'success.light') {
            setAddWordState &&
              setAddWordState({
                inputWord: {
                  wordName: '',
                  sourceId: -1,
                  subSourceName: ''
                },
                pronounce: '',
                meanArrayData: []
              });
          }
        }}
      />
      <Card variant={'outlined'} attr={'padding'}>
        <TextField
          className={['fullWidth', 'textField']}
          label="New Word"
          id="newWord"
          value={addWordState.inputWord.wordName}
          setStater={(value: string) => {
            setAddWordState &&
              setAddWordState({
                ...addWordState,
                inputWord: {
                  ...addWordState.inputWord,
                  wordName: value
                }
              });
          }}
        />
        {displaySourceInput()}
        <TextField
          className={['fullWidth', 'textField']}
          label="サブ出典"
          id="subSource"
          value={addWordState.inputWord.subSourceName}
          setStater={(value: string) => {
            setAddWordState &&
              setAddWordState({
                ...addWordState,
                inputWord: {
                  ...addWordState.inputWord,
                  subSourceName: value
                }
              });
          }}
        />
      </Card>
    </>
  );
};
