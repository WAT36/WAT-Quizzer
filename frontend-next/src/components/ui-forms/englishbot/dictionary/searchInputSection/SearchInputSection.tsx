import React, { useState } from 'react';
import { Button, FormControl, FormGroup, TextField } from '@mui/material';
import type { GridRowsProp } from '@mui/x-data-grid';
import type { SearchWordAPIRequestDto, Message } from 'quizzer-lib';
import { searchWordAPI } from '@/utils/api-wrapper';
import { Card } from '@/components/ui-elements/card/Card';

interface SearchInputSectionProps {
  setMessage?: React.Dispatch<React.SetStateAction<Message>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const SearchInputSection = ({ setMessage, setSearchResult }: SearchInputSectionProps) => {
  const [queryOfSearchWord, setQueryOfSearchWord] = useState<SearchWordAPIRequestDto>({ wordName: '' });

  return (
    <Card attr={['through-card', 'padding']}>
      <FormGroup>
        <FormControl margin={'dense'}>
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

        <FormControl margin={'dense'}>
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

        <FormControl margin={'dense'} className={'!flex-row items-center'}>
          {'サブ出典：'}
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
        className="!m-[10px]"
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
    </Card>
  );
};
