import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

interface TodoColumnsHandlers {
  onDelete: (id: number) => Promise<void>;
  onRestore: (id: number) => Promise<void>;
}

// TODO一覧テーブルの列定義。削除・復元ボタンを押したときの処理は画面側から受け取る
export const createTodoColumns = ({ onDelete, onRestore }: TodoColumnsHandlers): GridColDef<GridValidRowModel>[] => [
  {
    field: 'id',
    headerName: 'ID',
    width: 100
  },
  {
    field: 'todo',
    headerName: 'TODO',
    flex: 1,
    minWidth: 200
  },
  {
    field: 'actions',
    headerName: '',
    width: 60,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const isDeleted = !!params.row.deleted_at;
      return isDeleted ? (
        <IconButton size="small" color="primary" onClick={() => onRestore(params.row.id as number)} title="復元">
          <RestoreFromTrashIcon fontSize="small" />
        </IconButton>
      ) : (
        <IconButton size="small" color="error" onClick={() => onDelete(params.row.id as number)} title="削除">
          <DeleteIcon fontSize="small" />
        </IconButton>
      );
    }
  }
];
