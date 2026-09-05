import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowClassNameParams,
  GridRowSelectionModel,
  GridRowsProp,
  GridValidRowModel
} from '@mui/x-data-grid';
import { Tooltip } from '@/components/ui-elements/tooltip/Tooltip';

interface SearchResultTableProps {
  searchResult: GridRowsProp;
  columns: GridColDef<GridValidRowModel>[];
  hasCheck?: boolean;
  checkedIdList?: number[];
  setCheckedIdList?: React.Dispatch<React.SetStateAction<number[]>>;
  getRowClassName?: (params: GridRowClassNameParams) => string;
}

// 独自のrenderCellを持たない列に補完するデフォルトのセル描画
const renderCellWithTooltip = (params: GridRenderCellParams) => {
  const text = params.formattedValue ?? params.value;
  return <Tooltip text={text == null ? '' : String(text)} />;
};

export const SearchResultTable = ({
  searchResult,
  columns,
  hasCheck,
  checkedIdList,
  setCheckedIdList,
  getRowClassName
}: SearchResultTableProps) => {
  // チェックした問題のIDをステートに登録
  const registerCheckedIdList = (selectionModel: GridRowSelectionModel) => {
    setCheckedIdList && setCheckedIdList(selectionModel as number[]);
  };

  // 独自のrenderCellを持たない列にのみ、ホバー/タップで全文表示するTooltipを補完する
  const columnsWithTooltip = columns.map((column) => (column.renderCell ? column : { ...column, renderCell: renderCellWithTooltip }));

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-x-auto">
      <DataGrid
        rows={searchResult}
        columns={columnsWithTooltip}
        pageSizeOptions={[15]}
        checkboxSelection={hasCheck}
        disableRowSelectionOnClick
        rowSelectionModel={checkedIdList ?? []}
        onRowSelectionModelChange={(selectionModel, details) => registerCheckedIdList(selectionModel)}
        className="border-0 min-w-[640px]"
        autoHeight
        density="compact"
        getRowClassName={getRowClassName}
      />
    </div>
  );
};
