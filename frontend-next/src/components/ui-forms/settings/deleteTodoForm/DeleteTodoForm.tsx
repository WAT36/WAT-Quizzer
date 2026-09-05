import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CardContent, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import styles from '../Settings.module.css';
import { Card } from '@/components/ui-elements/card/Card';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { GetTodoListApiResponseDto } from 'quizzer-lib';
import { getTodoListAPI, getTodoListAllAPI, deleteTodoAPI, restoreTodoAPI } from '@/utils/api-wrapper';
import { SearchResultTable } from '@/components/ui-elements/searchResultTable/SearchResultTable';
import { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

interface DeleteTodoFormProps {}

export const DeleteTodoForm = ({}: DeleteTodoFormProps) => {
  const [todoList, setTodoList] = useState<GetTodoListApiResponseDto[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setMessage = useSetRecoilState(messageState);

  // Todoリストを取得
  const fetchTodoList = useCallback(
    async (includeDeleted: boolean) => {
      setIsLoading(true);
      setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
      const result = includeDeleted ? await getTodoListAllAPI() : await getTodoListAPI({ getTodoListRequestData: {} });
      setMessage(result.message);
      if (result.result && Array.isArray(result.result)) {
        setTodoList(result.result as GetTodoListApiResponseDto[]);
      }
      setIsLoading(false);
    },
    [setMessage]
  );

  // 初回マウント時にTodoリストを取得
  useEffect(() => {
    fetchTodoList(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 削除済み表示トグル
  const handleToggleShowDeleted = async (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setShowDeleted(checked);
    await fetchTodoList(checked);
  };

  // 1件削除処理
  const handleDelete = useCallback(
    async (id: number) => {
      setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
      const result = await deleteTodoAPI({ deleteTodoAPIRequestData: { id } });
      setMessage(result.message);
      if (result.message.messageColor === 'success.light') {
        await fetchTodoList(showDeleted);
      }
    },
    [fetchTodoList, setMessage, showDeleted]
  );

  // 1件復元処理
  const handleRestore = useCallback(
    async (id: number) => {
      setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
      const result = await restoreTodoAPI({ restoreTodoAPIRequestData: { id } });
      setMessage(result.message);
      if (result.message.messageColor === 'success.light') {
        await fetchTodoList(showDeleted);
      }
    },
    [fetchTodoList, setMessage, showDeleted]
  );

  // カラム定義
  // TODO カラム定義類はあどこか別ファイルに置いておきたい
  const columns: GridColDef<GridValidRowModel>[] = useMemo(
    () => [
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
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleRestore(params.row.id as number)}
              title="復元"
            >
              <RestoreFromTrashIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id as number)} title="削除">
              <DeleteIcon fontSize="small" />
            </IconButton>
          );
        }
      }
    ],
    [handleDelete, handleRestore]
  );

  return (
    <>
      <Card variant="outlined" subHeader="TODO削除" attr={['margin-vertical', 'padding']}>
        <CardContent className={`${styles.cardContent} !flex-col`}>
          <div className="!mb-4">
            <FormControlLabel
              control={<Checkbox checked={showDeleted} onChange={handleToggleShowDeleted} size="small" />}
              label="削除済みも表示"
            />
          </div>
          {isLoading ? (
            <div className="text-center py-4">読み込み中...</div>
          ) : (
            <SearchResultTable
              searchResult={todoList}
              columns={columns}
              getRowClassName={(params) =>
                params.row.deleted_at ? 'bg-red-50 dark:bg-red-900/30 text-gray-400 dark:text-gray-500' : ''
              }
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};
