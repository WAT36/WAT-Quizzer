import { PULLDOWN_NONE_VALUE, PULLDOWN_OTHER_VALUE } from '@/constants/pullDown';
import { PullDownWithOther } from '@/components/ui-parts/pullDownWithOther/PullDownWithOther';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';
import type { AddWordAPIRequestDto, PullDownOptionDto, Message } from 'quizzer-lib';
import { addWordAPI } from '@/utils/api-wrapper';
import React from 'react';

interface InputAddWordFormProps {
  sourceList: PullDownOptionDto[];
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  addWordState: AddWordAPIRequestDto;
  setAddWordState?: React.Dispatch<React.SetStateAction<AddWordAPIRequestDto>>;
}

export const InputAddWordForm = ({ sourceList, addWordState, setMessage, setAddWordState }: InputAddWordFormProps) => {
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
          const result = await addWordAPI({ addWordData: addWordState });
          setMessage && setMessage(result.message);
          if (result.isSuccess) {
            setAddWordState &&
              setAddWordState({
                inputWord: {
                  wordName: '',
                  sourceId: PULLDOWN_NONE_VALUE,
                  subSourceName: ''
                },
                pronounce: '',
                meanArrayData: []
              });
          }
        }}
      />
      <Card variant={'outlined'} attr={['padding']}>
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
        <PullDownWithOther
          label="出典"
          id="source-select"
          optionList={sourceList}
          value={addWordState.inputWord.sourceId}
          otherValue={addWordState.inputWord.newSourceName}
          onChange={(value) => {
            setAddWordState &&
              setAddWordState({
                ...addWordState,
                inputWord: {
                  ...addWordState.inputWord,
                  sourceId: value,
                  // 「その他」以外に切り替えたら、入力していた新しい出典名は送らない
                  newSourceName: value === PULLDOWN_OTHER_VALUE ? addWordState.inputWord.newSourceName : undefined
                }
              });
          }}
          onOtherChange={(value) => {
            setAddWordState &&
              setAddWordState({
                ...addWordState,
                inputWord: {
                  ...addWordState.inputWord,
                  newSourceName: value
                }
              });
          }}
        />
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
