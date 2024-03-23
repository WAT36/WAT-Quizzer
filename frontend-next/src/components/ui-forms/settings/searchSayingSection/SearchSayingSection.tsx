import React, { useState } from 'react';
import { MessageState } from '../../../../../interfaces/state';
import { CardContent } from '@mui/material';
import { searchSayingAPI } from '@/common/ButtonAPI';
import styles from '../Settings.module.css';
import { GridRowsProp } from '@mui/x-data-grid';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { Card } from '@/components/ui-elements/card/Card';
import { TextField } from '@/components/ui-elements/textField/TextField';
import { Button } from '@/components/ui-elements/button/Button';
import { searchSayingColumns } from '../../../../../utils/tableColumn';

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
      <Card variant="outlined" subHeader="格言検索" attr="margin-vertical padding">
        <CardContent className={styles.cardContent}>
          <TextField
            label="格言検索(部分一致)"
            className={['fullWidth']}
            variant="outlined"
            setStater={setQueryOfSaying}
          />
          <Button
            label={'検索'}
            variant="contained"
            color="primary"
            onClick={(e) => searchSayingAPI({ queryOfSaying, setMessageStater, setSearchResult })}
            attr={'after-inline'}
          />
        </CardContent>
        <SearchResultTable
          searchResult={searchResult}
          columns={searchSayingColumns}
          setCheckedIdList={setCheckedIdList}
        />
      </Card>
    </>
  );
};
