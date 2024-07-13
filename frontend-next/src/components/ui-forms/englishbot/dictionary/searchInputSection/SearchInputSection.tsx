import React, { useState } from 'react';
import { Button, FormControl, FormGroup, TextField } from '@mui/material';
import { MessageState } from '../../../../../../interfaces/state';
import styles from '../Dictionary.module.css';
import { GridRowsProp } from '@mui/x-data-grid';
import { searchWordAPI, SearchWordAPIRequestDto } from 'quizzer-lib';

interface SearchInputSectionProps {
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const SearchInputSection = ({ setMessage, setSearchResult }: SearchInputSectionProps) => {
  const [queryOfSearchWord, setQueryOfSearchWord] = useState<SearchWordAPIRequestDto>({ wordName: '' });

  return (
    <>
      <FormGroup>
        <FormControl>
          <TextField
            label="単語名検索"
            onChange={(e) => {
              setQueryOfSearchWord({
                ...queryOfSearchWord,
                wordName: e.target.value
              });
            }}
          />
        </FormControl>

        <FormControl>
          <TextField
            label="意味検索"
            onChange={(e) => {
              setQueryOfSearchWord({
                ...queryOfSearchWord,
                meanQuery: e.target.value
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
                subSourceName: e.target.value
              });
            }}
          />
        </FormControl>
      </FormGroup>

      <Button
        className={styles.button}
        variant="contained"
        color="primary"
        onClick={async (e) => {
          setMessage && setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await searchWordAPI({ searchWordData: queryOfSearchWord });
          setSearchResult &&
            setSearchResult(
              Array.isArray(result.result)
                ? result.result.map((x) => {
                    return {
                      id: x.id,
                      name: x.name,
                      pronounce: x.pronounce,
                      meaning: x.mean.length > 0 ? x.mean[0].meaning : ''
                    };
                  })
                : []
            );
          setMessage && setMessage(result.message);
        }}
      >
        検索
      </Button>
    </>
  );
};
