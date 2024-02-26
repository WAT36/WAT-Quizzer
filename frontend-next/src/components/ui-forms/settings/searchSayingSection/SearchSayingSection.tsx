import React, { useState } from 'react';
import { MessageState } from '../../../../../interfaces/state';
import { Button, Card, CardContent, CardHeader, TextField } from '@mui/material';
import { searchSayingAPI } from '@/common/ButtonAPI';
import styles from '../Settings.module.css';
import { GridRowsProp } from '@mui/x-data-grid';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    sortable: true,
    width: 10
  },
  {
    field: 'saying',
    headerName: '格言',
    sortable: false,
    width: 300,
    type: 'string'
  },
  {
    field: 'explanation',
    headerName: '説明',
    sortable: false,
    width: 400
  },
  {
    field: 'name',
    headerName: '本',
    sortable: false,
    width: 100
  }
];

interface SearchSayingSectionProps {
  queryOfSaying: string;
  setQueryOfSaying?: React.Dispatch<React.SetStateAction<string>>;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setCheckedIdList?: React.Dispatch<React.SetStateAction<number[]>>;
}

export const SearchSayingSection = ({
  queryOfSaying,
  setQueryOfSaying,
  setMessageStater,
  setCheckedIdList
}: SearchSayingSectionProps) => {
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);

  return (
    <>
      <Card variant="outlined">
        <CardHeader subheader="格言検索" />
        <CardContent className={styles.cardContent}>
          <TextField
            label="格言検索(部分一致)"
            variant="outlined"
            onChange={(e) => {
              setQueryOfSaying && setQueryOfSaying(e.target.value);
            }}
            className={styles.inlineInput}
          />
          <Button
            variant="contained"
            className={styles.inlineButton}
            onClick={(e) => searchSayingAPI({ queryOfSaying, setMessageStater, setSearchResult })}
          >
            検索
          </Button>
        </CardContent>
        <SearchResultTable searchResult={searchResult} columns={columns} setCheckedIdList={setCheckedIdList} />
      </Card>
    </>
  );
};
