import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';

interface EditQuizIconButtonProps {
  fileNum: number;
  quizNum: number;
}

// 指定した問題の編集画面へ移るアイコンボタン
export const EditQuizIconButton = ({ fileNum, quizNum }: EditQuizIconButtonProps) => {
  const router = useRouter();

  return (
    <IconButton
      aria-label={`問題${fileNum}-${quizNum}を編集`}
      onClick={() => {
        void router.push({
          pathname: '/quizzer/editQuiz',
          query: { file_num: fileNum, quiz_num: quizNum }
        });
      }}
    >
      <EditIcon />
    </IconButton>
  );
};
