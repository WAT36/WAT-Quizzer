import { Card } from '@/components/ui-elements/card/Card';
import {
  CardContent,
  CardActions,
  Typography,
  CircularProgress,
  Collapse,
  Button as MuiButton,
  Alert
} from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import {
  GetQuizApiResponseDto,
  GetQuizAPIRequestDto,
  initGetQuizResponseData,
  generateQuizSentense,
  GetQuizFileApiResponseDto,
  Message
} from 'quizzer-lib';
import { getQuizAPI, getQuizFileListAPI, clearQuizAPI, failQuizAPI } from '@/utils/api-wrapper';
import { DisplaySentence } from '@/components/ui-elements/sentence/DisplaySentence';
import { Chip } from '@/components/ui-elements/chip/Chip';
import { Button } from '@/components/ui-elements/button/Button';

interface RandomQuizCardProps {
  file_num: number;
}

export const RandomQuizCard = ({ file_num }: RandomQuizCardProps) => {
  const [randomQuizData, setRandomQuizData] = useState<GetQuizApiResponseDto>(initGetQuizResponseData);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    (async () => {
      let targetFileNum = file_num;

      // file_numが-1の場合は、実在するファイルからランダムに選択
      if (file_num === -1) {
        const fileListResult = await getQuizFileListAPI();
        if (fileListResult.result && Array.isArray(fileListResult.result)) {
          const fileList = fileListResult.result as GetQuizFileApiResponseDto[];
          if (fileList.length > 0) {
            const randomIndex = Math.floor(Math.random() * fileList.length);
            targetFileNum = fileList[randomIndex].file_num;
          } else {
            // ファイルが存在しない場合は処理を終了
            return;
          }
        } else {
          // ファイル一覧の取得に失敗した場合は処理を終了
          return;
        }
      }

      // ランダム問題を取得
      const getQuizRequestData: GetQuizAPIRequestDto = {
        file_num: targetFileNum
      };
      const result = await getQuizAPI({
        getQuizRequestData,
        getQuizMethod: 'random'
      });
      if (result.result) {
        setRandomQuizData(result.result as GetQuizApiResponseDto);
        setIsAnswered(false);
        setExpanded(false);
        setMessage(null);
      }
    })();
  }, [file_num]);

  const displayQuiz = useMemo(() => {
    return {
      ...randomQuizData,
      ...generateQuizSentense(randomQuizData)
    };
  }, [randomQuizData]);

  return (
    <Card variant="outlined" attr={['margin-vertical']}>
      <div className="h-[350px] flex flex-col">
        <CardContent className="flex-shrink-0">
          <Typography variant="h6" component="h2" className="mb-2">
            ランダム問題
          </Typography>
        </CardContent>
        <div className="flex-1 overflow-y-auto min-h-0">
          <CardContent>
            {randomQuizData.id !== -1 ? (
              <>
                <DisplaySentence checked={randomQuizData.checked} sentence={displayQuiz.quiz_sentense || ''} />
                {displayQuiz.quiz_category &&
                  displayQuiz.quiz_category.map((category, index) => {
                    return <Chip key={index} label={category.category} />;
                  })}
              </>
            ) : (
              <CircularProgress aria-label="読み込み中" />
            )}
          </CardContent>
          {randomQuizData.id !== -1 && (
            <>
              <CardActions className="flex-shrink-0">
                <MuiButton size="small" onClick={handleExpandClick} aria-expanded={expanded}>
                  答え
                </MuiButton>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <div className="overflow-y-auto">
                    <DisplaySentence sentence={displayQuiz.answer || ''} />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      label={'正解!!'}
                      attr={'button-array'}
                      variant="contained"
                      color="primary"
                      disabled={randomQuizData.quiz_num === -1 || isAnswered}
                      onClick={async () => {
                        setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
                        const result = await clearQuizAPI({
                          getQuizResponseData: randomQuizData
                        });
                        setMessage(result.message);
                        if (result.message.messageColor === 'success.light') {
                          setIsAnswered(true);
                        }
                      }}
                    />
                    <Button
                      label={'不正解...'}
                      attr={'button-array'}
                      variant="contained"
                      color="secondary"
                      disabled={randomQuizData.quiz_num === -1 || isAnswered}
                      onClick={async () => {
                        setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
                        const result = await failQuizAPI({
                          getQuizResponseData: randomQuizData
                        });
                        setMessage(result.message);
                        if (result.message.messageColor === 'success.light') {
                          setIsAnswered(true);
                        }
                      }}
                    />
                  </div>
                  {message && message.isDisplay && (
                    <Alert
                      severity={
                        message.messageColor === 'success.light'
                          ? 'success'
                          : message.messageColor === 'error'
                            ? 'error'
                            : 'info'
                      }
                      className="mt-2"
                      onClose={() => setMessage({ ...message, isDisplay: false })}
                    >
                      {message.message === '通信中...' ? (
                        <div className="flex items-center gap-2">
                          <CircularProgress aria-label="読み込み中" size={16} />
                          {message.message}
                        </div>
                      ) : (
                        message.message
                      )}
                    </Alert>
                  )}
                </CardContent>
              </Collapse>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
