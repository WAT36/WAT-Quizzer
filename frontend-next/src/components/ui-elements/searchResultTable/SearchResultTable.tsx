import React from 'react';
import styles from './SearchResultTable.module.css';
import { DataGrid, GridColDef, GridRowSelectionModel, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';

interface SearchResultTableProps {
  searchResult: GridRowsProp;
  columns: GridColDef<GridValidRowModel>[];
  setCheckedIdList?: React.Dispatch<React.SetStateAction<number[]>>;
}

export const SearchResultTable = ({ searchResult, columns, setCheckedIdList }: SearchResultTableProps) => {
  // チェックした問題のIDをステートに登録
  const registerCheckedIdList = (selectionModel: GridRowSelectionModel) => {
    setCheckedIdList && setCheckedIdList(selectionModel as number[]);
  };

  return (
    <div className={styles.searchResultTable}>
      <DataGrid
        rows={searchResult}
        columns={columns}
        pageSizeOptions={[15]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel)}
      />
    </div>
  );
};
