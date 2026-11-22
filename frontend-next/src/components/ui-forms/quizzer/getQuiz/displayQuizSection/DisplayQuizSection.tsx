import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
  Button as MuiButton,
  CardActions,
  CardContent,
  Collapse,
  Typography,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import type { GetQuizApiResponseDto, GetImageOfQuizAPIResponseDto } from 'quizzer-lib';
import { generateQuizSentense } from 'quizzer-lib';
import { reverseCheckQuizAPI, getImageOfQuizAPI } from '@/utils/api-wrapper';
import { Chip } from '@/components/ui-elements/chip/Chip';
import { DisplaySentence } from '@/components/ui-elements/sentence/DisplaySentence';
import { EditQuizIconButton } from '@/components/ui-parts/editQuizIconButton/EditQuizIconButton';
import { ImageSearchModal } from '@/components/ui-forms/quizzer/getQuiz/imageSearchModal/ImageSearchModal';

interface DisplayQuizSectionProps {
  getQuizResponseData: GetQuizApiResponseDto;
  // 問題文に✅を付けるかどうか
  checked?: boolean;
  imageUrl: string;
  setImageUrl?: React.Dispatch<React.SetStateAction<string>>;
  // 正解/不正解ボタン押下時に呼ぶ。結果登録に成功したら、実際に次の問題へ進める「確定関数」を返す
  // （答えの表示エリアが閉じきってから確定関数を呼ぶことで、次の問題の答えが一瞬見えてしまうのを防ぐ）
  onAnswer: (isCorrect: boolean) => Promise<(() => void) | null>;
  // チェックの登録が成功した後に呼ぶ
  onCheckReversed: (quizId: number) => void;
  // 問題に紐付いている画像のファイル名（出題中に登録した画像を含む。未指定なら問題データのimg_file）
  imageFile?: string | null;
  // 画像を探して登録できた後に呼ぶ
  onImageRegistered?: (quizId: number, fileName: string) => void;
}

export const DisplayQuizSection = ({
  getQuizResponseData,
  checked,
  imageUrl,
  setImageUrl,
  onAnswer,
  onCheckReversed,
  imageFile,
  onImageRegistered
}: DisplayQuizSectionProps) => {
  const setMessage = useSetRecoilState(messageState);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [hideAccuracyRate, setHideAccuracyRate] = useState<boolean>(false);
  const [autoDisplayImage, setAutoDisplayImage] = useState<boolean>(false);
  const [imageSearchOpen, setImageSearchOpen] = useState<boolean>(false);
  const currentImageFile = imageFile === undefined ? getQuizResponseData.img_file : imageFile;
  const prevQuizSentenseRef = useRef<string>(getQuizResponseData.quiz_sentense);
  const pendingAdvanceRef = useRef<(() => void) | null>(null);
  const displayQuiz = useMemo(() => {
    const generated = generateQuizSentense(getQuizResponseData);
    // チェックボックスがONの時（hideAccuracyRateがtrue）は正解率を削除
    let quizSentense = generated.quiz_sentense || '';
    if (hideAccuracyRate && quizSentense) {
      // 正解率・解答数のパターン (正解率XX.XX%)(解答数N回) を削除
      quizSentense = quizSentense.replace(/\(正解率[\d.]+%\)(\(解答数\d+回\))?/g, '');
    }
    return {
      ...getQuizResponseData,
      ...generated,
      quiz_sentense: quizSentense
    };
  }, [getQuizResponseData, hideAccuracyRate]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // 正解/不正解ボタン押下時の処理
  const handleAnswer = async (isCorrect: boolean) => {
    const advance = await onAnswer(isCorrect);
    if (!advance) return;
    // 答えの表示エリアを閉じ始める。実際に次の問題へ進めるのはCollapseが閉じきってから（onExited）
    pendingAdvanceRef.current = advance;
    setExpanded(false);
  };

  // 画像を取得して問題文の下に表示する
  // keepMessage: 直前のメッセージ（「画像を登録しました」など）を残し、取得に失敗した時だけメッセージを出す
  const displayImage = useCallback(
    async (fileName: string, { keepMessage = false }: { keepMessage?: boolean } = {}) => {
      if (!setImageUrl) return;
      if (!keepMessage) {
        setMessage({ message: '画像取得中...', messageColor: '#d3d3d3', isDisplay: true });
      }
      const result = await getImageOfQuizAPI({ getImageOfQuizRequestData: { fileName } });
      if (!keepMessage || !result.isSuccess) {
        setMessage(result.message);
      }
      if (result.result) {
        const res = result.result as GetImageOfQuizAPIResponseDto;
        setImageUrl(res.imageUrl);
      }
    },
    [setImageUrl, setMessage]
  );

  // 出題変わったら閉じる、画像自動表示の場合は画像を取得
  useEffect(() => {
    if (prevQuizSentenseRef.current !== getQuizResponseData.quiz_sentense) {
      prevQuizSentenseRef.current = getQuizResponseData.quiz_sentense;
      // 出題が変わったときに表示状態をリセットするため、effect内でstateを更新する
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpanded(false);
      setImageUrl && setImageUrl('');

      // 自動画像表示がONで、画像ファイル名がある場合は自動的に画像を取得
      if (autoDisplayImage && currentImageFile) {
        void displayImage(currentImageFile);
      }
    }
  }, [getQuizResponseData.quiz_sentense, currentImageFile, autoDisplayImage, displayImage, setImageUrl]);

  return (
    <>
      <Card variant="outlined">
        <CardContent className="!m-[8px] shadow-lg bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="h5" component="h2" className="flex items-center justify-start h-full">
              問題
              {displayQuiz.file_num !== -1 && displayQuiz.quiz_num !== -1 && (
                <EditQuizIconButton fileNum={displayQuiz.file_num} quizNum={displayQuiz.quiz_num} />
              )}
            </Typography>
            <div className="flex gap-4">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hideAccuracyRate}
                    onChange={(e) => setHideAccuracyRate(e.target.checked)}
                    size="small"
                  />
                }
                label="正解率を非表示"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autoDisplayImage}
                    onChange={(e) => setAutoDisplayImage(e.target.checked)}
                    size="small"
                  />
                }
                label="画像を自動表示"
              />
            </div>
          </div>
          <DisplaySentence checked={checked} sentence={displayQuiz.quiz_sentense} />
          {imageUrl && (
            // 取得した画像のURLはサイズが不定で、静的エクスポート(output: 'export')では画像最適化も使えないため<img>を使う
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="取得した画像" className="max-h-[192px] max-w-full object-contain my-[8px] block" />
          )}
          {displayQuiz.quiz_category &&
            displayQuiz.quiz_category.map((category, index) => {
              return <Chip key={index} label={category.category} />;
            })}
          <Typography variant="subtitle2" component="span" className="text-gray-400 dark:text-gray-500">
            {displayQuiz.count && `(取得問題数${String(displayQuiz.count)}問中)`}
          </Typography>
        </CardContent>

        <CardActions>
          <MuiButton size="small" onClick={handleExpandClick} aria-expanded={expanded}>
            答え
          </MuiButton>
        </CardActions>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          onExited={() => {
            if (pendingAdvanceRef.current) {
              const advance = pendingAdvanceRef.current;
              pendingAdvanceRef.current = null;
              advance();
              setImageUrl && setImageUrl('');
            }
          }}
        >
          <CardContent>
            <DisplaySentence sentence={displayQuiz.answer} />
            <Typography variant="subtitle2" component="h3">
              {displayQuiz.quiz_explanation?.explanation.split(/(\\n)/).map((item, index) => {
                return <React.Fragment key={index}>{item.match(/\\n/) ? <br /> : item}</React.Fragment>;
              })}
            </Typography>
            <Button
              label={'正解!!'}
              attr={'button-array'}
              variant="contained"
              color="primary"
              disabled={getQuizResponseData.quiz_num === -1}
              onClick={() => handleAnswer(true)}
            />
            <Button
              label={'不正解...'}
              attr={'button-array'}
              variant="contained"
              color="secondary"
              disabled={getQuizResponseData.quiz_num === -1}
              onClick={() => handleAnswer(false)}
            />
            <Button
              label={'チェックつける/外す'}
              attr={'button-array'}
              variant="contained"
              color="warning"
              disabled={getQuizResponseData.quiz_num === -1}
              onClick={async (e) => {
                setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
                const result = await reverseCheckQuizAPI({
                  getQuizResponseData
                });
                setMessage(result.message);
                if (result.isSuccess) {
                  onCheckReversed(getQuizResponseData.id);
                }
              }}
            />
            {/* 正解・不正解（押すと次の問題に進む）と押し間違えないよう、枠線だけのボタンにする */}
            <Button
              label={currentImageFile ? '画像を探して差し替え' : '画像を探して登録'}
              attr={'button-array'}
              variant="outlined"
              color="info"
              disabled={getQuizResponseData.quiz_num === -1 || !onImageRegistered}
              onClick={() => setImageSearchOpen(true)}
            />
          </CardContent>
        </Collapse>
      </Card>
      {/* 開いた時に検索を始めるので、開いている間だけ描画する */}
      {imageSearchOpen && (
        <ImageSearchModal
          isOpen={imageSearchOpen}
          setIsOpen={setImageSearchOpen}
          quizId={getQuizResponseData.id}
          quizSentence={getQuizResponseData.quiz_sentense}
          answer={getQuizResponseData.answer}
          hasImage={!!currentImageFile}
          onRegistered={(fileName) => {
            onImageRegistered?.(getQuizResponseData.id, fileName);
            // 登録できたことが分かるよう、自動表示の設定にかかわらずすぐ表示する
            void displayImage(fileName, { keepMessage: true });
          }}
        />
      )}
    </>
  );
};
