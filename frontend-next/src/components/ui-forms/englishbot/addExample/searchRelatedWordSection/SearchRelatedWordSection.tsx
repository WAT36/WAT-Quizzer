import React, { useState } from 'react';
import { Card } from '@/components/ui-elements/card/Card';
import { CardContent } from '@mui/material';
import styles from '../AddExample.module.css';
import commonStyles from '../../../../common.module.css';
import { InputExampleData } from '@/pages/englishBot/addExample';
import { DataGrid, GridRowSelectionModel, GridRowsProp } from '@mui/x-data-grid';
import { searchWordAPI } from '@/common/ButtonAPI';
import { MessageState } from '../../../../../../interfaces/state';
import { meanColumns } from '../../../../../../utils/englishBot/SearchWordTable';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';

interface SearchRelatedWordSectionProps {
  inputExampleData: InputExampleData;
  setMessage?: React.Dispatch<React.SetStateAction<MessageState>>;
  setInputExampleData?: React.Dispatch<React.SetStateAction<InputExampleData>>;
}

export const SearchRelatedWordSection = ({
  inputExampleData,
  setMessage,
  setInputExampleData
}: SearchRelatedWordSectionProps) => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<GridRowsProp>([] as GridRowsProp);

  // チェックした問題のIDをステートに登録
  const registerCheckedIdList = (selectionModel: GridRowSelectionModel) => {
    setInputExampleData &&
      setInputExampleData({
        ...inputExampleData,
        meanId: selectionModel as number[]
      });
  };

  return (
    <>
      <CardContent>
        <Card variant="outlined" subHeader="関連付け単語検索">
          <CardContent className={commonStyles.cardContent}>
            <TextField
              label="単語検索(完全一致)"
              variant="outlined"
              className={['fullWidth']}
              setStater={(value: string) => {
                setQuery(value);
              }}
            />
            <Button
              label={'検索'}
              variant="contained"
              color="primary"
              attr={'after-inline'}
              onClick={(e) => searchWordAPI({ query, setMessage, setSearchResult })}
            />
          </CardContent>

          <CardContent className={styles.searchedTable}>
            <DataGrid
              rows={searchResult}
              columns={meanColumns}
              pageSizeOptions={[15]}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel)}
            />
          </CardContent>
        </Card>
      </CardContent>
    </>
  );
};
