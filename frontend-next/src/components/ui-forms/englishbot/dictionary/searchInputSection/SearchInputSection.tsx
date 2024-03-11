import React, { useState } from 'react';
import { Button, FormControl, FormGroup, TextField } from '@mui/material';
import { MessageState, QueryOfSearchWordState } from '../../../../../../interfaces/state';
import styles from '../Dictionary.module.css';
import { GridRowsProp } from '@mui/x-data-grid';
import { searchWordForDictionary } from '@/common/ButtonAPI';

interface SearchInputSectionProps {
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const SearchInputSection = ({ setMessage, setSearchResult }: SearchInputSectionProps) => {
  const [queryOfSearchWord, setQueryOfSearchWord] = useState<QueryOfSearchWordState>({ query: '' });
  return (
    <>
      <FormGroup>
        <FormControl>
          <TextField
            label="単語名検索"
            onChange={(e) => {
              setQueryOfSearchWord({
                ...queryOfSearchWord,
                query: e.target.value
              });
            }}
          />
        </FormControl>

        <FormControl className={styles.row}>
          サブ出典：
          <TextField
            label="Sub Source"
            onChange={(e) => {
              setQueryOfSearchWord({
                ...queryOfSearchWord,
                subSource: {
                  ...queryOfSearchWord.subSource,
                  query: e.target.value
                }
              });
            }}
          />
        </FormControl>
      </FormGroup>

      <Button
        className={styles.button}
        variant="contained"
        color="primary"
        onClick={(e) => searchWordForDictionary({ queryOfSearchWord, setMessage, setSearchResult })}
      >
        検索
      </Button>
    </>
  );
};
