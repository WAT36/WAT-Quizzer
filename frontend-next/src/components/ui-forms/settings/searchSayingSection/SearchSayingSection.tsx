import React, { useState } from 'react';
import { CardContent } from '@mui/material';
import styles from '../Settings.module.css';
import { GridRowsProp } from '@mui/x-data-grid';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';
import { searchSayingColumns } from '../../../../../utils/tableColumn';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { searchSayingAPI, SearchSayingAPIRequestDto } from 'quizzer-lib';

interface SearchSayingSectionProps {}

export const SearchSayingSection = ({}: SearchSayingSectionProps) => {
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);
  const [searchSayingRequestData, setSearchSayingRequestData] = useState<SearchSayingAPIRequestDto>({ saying: '' });
  const setMessage = useSetRecoilState(messageState);
  return (
    <>
      <Card variant="outlined" subHeader="格言検索" attr="margin-vertical padding">
        <CardContent className={styles.cardContent}>
          <TextField
            label="格言検索(部分一致)"
            className={['fullWidth']}
            variant="outlined"
            setStater={(value: string) => {
              setSearchSayingRequestData({
                ...searchSayingRequestData,
                saying: value
              });
            }}
          />
          <Button
            label={'検索'}
            variant="contained"
            color="primary"
            onClick={async (e) => {
              setMessage({
                message: '通信中...',
                messageColor: '#d3d3d3',
                isDisplay: true
              });
              const result = await searchSayingAPI({ searchSayingRequestData });
              setMessage(result.message);
              if (Array.isArray(result.result)) {
                setSearchResult(
                  result.result.map((x) => {
                    return {
                      id: x.id,
                      explanation: x.explanation,
                      saying: x.saying,
                      name: x.selfhelp_book.name
                    };
                  })
                );
              }
            }}
            attr={'after-inline'}
          />
        </CardContent>
        <SearchResultTable searchResult={searchResult} columns={searchSayingColumns} />
      </Card>
    </>
  );
};
