import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CardContent, Typography, Box } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { Checkbox } from '@/components/ui-elements/checkBox/CheckBox';
import { getTodayKey, GetTodoListApiResponseDto } from 'quizzer-lib';
import { addTodoDiaryAPI, getTodoCheckStatusAPI, getTodoListAPI, saveTodoCheckStatusAPI } from '@/utils/api-wrapper';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoListProps {}

// APIから取得したTODOをTodo形式に変換
const convertApiTodosToTodos = (apiTodos: GetTodoListApiResponseDto[]): Todo[] => {
  return apiTodos.map((apiTodo) => ({
    id: apiTodo.id,
    title: apiTodo.todo,
    completed: false
  }));
};

export const TodoList = ({}: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(getTodayKey());
  const [isLoading, setIsLoading] = useState(false);
  const prevAllCompletedRef = useRef<boolean>(false);
  const todoDiaryRegisteredRef = useRef<boolean>(false);

  // APIからTodoリストとチェック状態を取得
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    const todayKey = getTodayKey();

    // Todoリストとチェック状態を並列で取得
    const [todoListResult, checkStatusResult] = await Promise.all([
      getTodoListAPI({ getTodoListRequestData: {} }),
      getTodoCheckStatusAPI({
        getTodoCheckStatusAPIRequest: { date: todayKey }
      })
    ]);

    if (todoListResult.result && Array.isArray(todoListResult.result)) {
      const apiTodos = todoListResult.result as GetTodoListApiResponseDto[];
      const convertedTodos = convertApiTodosToTodos(apiTodos);

      // DynamoDBから取得したチェック状態を適用
      let completedIds: number[] = [];
      if (checkStatusResult.result && 'completedTodoIds' in checkStatusResult.result) {
        completedIds = (checkStatusResult.result as { completedTodoIds: number[] }).completedTodoIds;
      }

      const todosWithCompleted = convertedTodos.map((todo) => ({
        ...todo,
        completed: completedIds.includes(todo.id)
      }));

      setTodos(todosWithCompleted);
    }
    setIsLoading(false);
  }, []);

  // 初回マウント時にTodoリストを取得
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 日付が変わったらリセット
  useEffect(() => {
    const checkDateChange = () => {
      const todayKey = getTodayKey();
      if (todayKey !== currentDate) {
        setCurrentDate(todayKey);
        // 前回のallCompleted状態もリセット
        prevAllCompletedRef.current = false;
        // Todo日記の登録済みフラグもリセット
        todoDiaryRegisteredRef.current = false;
        // APIから再取得して、チェック状態をリセット
        fetchTodos();
      }
    };

    // 初回マウント時と日付変更時のチェック
    checkDateChange();

    // 1分ごとに日付の変更をチェック（0:00を検知するため）
    const interval = setInterval(checkDateChange, 60000);

    return () => clearInterval(interval);
  }, [currentDate, fetchTodos]);

  // チェック状態が変わったらDynamoDBに保存
  useEffect(() => {
    // 初回マウント時は保存しない（fetchTodosで既に取得済み）
    if (todos.length === 0) return;

    const todayKey = getTodayKey();
    const completedIds = todos.filter((todo) => todo.completed).map((todo) => todo.id);

    // デバウンス処理（連続した変更を防ぐ）
    const timeoutId = setTimeout(() => {
      saveTodoCheckStatusAPI({
        saveTodoCheckStatusAPIRequest: {
          date: todayKey,
          completedTodoIds: completedIds
        }
      }).catch((error) => {
        console.error('Failed to save todo check status:', error);
      });
    }, 500); // 500ms後に保存

    return () => clearTimeout(timeoutId);
  }, [todos]);

  const handleToggle = (id: number) => {
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const allCompleted = todos.length > 0 && todos.every((todo) => todo.completed);

  // 全Todo完了時にTodo日記を登録
  useEffect(() => {
    // allCompletedがfalseからtrueに変わった時、かつその日に未登録の場合のみAPIを呼び出す
    if (allCompleted && !prevAllCompletedRef.current && !todoDiaryRegisteredRef.current) {
      const todayKey = getTodayKey();
      addTodoDiaryAPI({
        addTodoDiaryAPIRequest: {
          date: todayKey
        }
      })
        .then((result) => {
          if (result.message.messageColor === 'success.light') {
            // 登録成功時、その日の登録済みフラグを設定
            todoDiaryRegisteredRef.current = true;
          }
          // エラーメッセージは表示しない（バックグラウンド処理のため）
        })
        .catch((error) => {
          console.error('Failed to register todo diary:', error);
        });
    }
    // 前回の状態を更新
    prevAllCompletedRef.current = allCompleted;
  }, [allCompleted]);

  return (
    <Card variant="outlined" attr={['margin-vertical']}>
      <Box
        sx={{
          backgroundColor: allCompleted ? '#c8e6c9' : 'transparent',
          transition: 'background-color 0.3s ease',
          borderRadius: '4px',
          minHeight: '100%'
        }}
      >
        <CardContent>
          <Typography variant="h6" component="h6" color="grey.700" sx={{ mb: 2 }}>
            今日のTodo
          </Typography>
          {allCompleted && (
            <Box
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              今日のTodoを全て完了しました！
            </Box>
          )}
          {isLoading ? (
            <Typography variant="body2" color="grey.700" sx={{ fontStyle: 'italic' }}>
              読み込み中...
            </Typography>
          ) : todos.length === 0 ? (
            <Typography variant="body2" color="grey.700" sx={{ fontStyle: 'italic' }}>
              Todoがありません
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {todos.map((todo) => (
                <Box
                  key={todo.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '4px',
                    backgroundColor: todo.completed ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    opacity: todo.completed ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Checkbox
                    value={String(todo.id)}
                    label={todo.title}
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                  />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};
