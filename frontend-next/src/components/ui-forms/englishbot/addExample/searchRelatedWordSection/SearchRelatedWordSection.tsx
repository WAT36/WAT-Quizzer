import React, { useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { Button, CardContent, CardHeader, TextField } from '@mui/material';
import styles from '../AddExample.module.css';
import { InputExampleData } from '@/pages/englishBot/addExample';
import { DataGrid, GridRowSelectionModel, GridRowsProp } from '@mui/x-data-grid';
import { searchWordAPI } from '@/common/ButtonAPI';
import { MessageState } from '../../../../../../interfaces/state';
import { meanColumns } from '../../../../../../utils/englishBot/SearchWordTable';

interface SearchRelatedWordSectionProps {
  searchResult: GridRowsProp;
  inputExampleData: InputExampleData;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
  setInputExampleData?: React.Dispatch<React.SetStateAction<InputExampleData>>;
}

export const SearchRelatedWordSection = ({
  searchResult,
  inputExampleData,
  setMessage,
  setSearchResult,
  setInputExampleData
}: SearchRelatedWordSectionProps) => {
  const [query, setQuery] = useState('');

  // チェックした問題のIDをステートに登録
  const registerCheckedIdList = (selectionModel: GridRowSelectionModel) => {
    const copyInputData = Object.assign({}, inputExampleData);
    copyInputData.meanId = selectionModel as number[];
    setInputExampleData && setInputExampleData(copyInputData);
  };

  return (
    <>
      <CardContent>
        <Card variant="outlined">
          <CardHeader subheader="関連付け単語検索" />
          <CardContent className={styles.content}>
            <TextField
              label="単語検索(完全一致)"
              variant="outlined"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              className={styles.inputText}
            />
            <Button
              variant="contained"
              className={styles.inlineButton}
              onClick={(e) => searchWordAPI({ query, setMessage, setSearchResult })}
            >
              検索
            </Button>
          </CardContent>

          <CardContent className={styles.content}>
            <div className={styles.searchedTable}>
              <DataGrid
                rows={searchResult}
                columns={meanColumns}
                pageSizeOptions={[15]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel)}
              />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
};
