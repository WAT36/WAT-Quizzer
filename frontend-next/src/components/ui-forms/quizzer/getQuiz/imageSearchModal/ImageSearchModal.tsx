import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonBase, Skeleton, TextField as MuiTextField, Typography } from '@mui/material';
import { useSetRecoilState } from 'recoil';
import type {
  ImportImageOfQuizAPIResponseDto,
  QuizImageCandidate,
  SearchImageCandidatesOfQuizAPIResponseDto
} from 'quizzer-lib';
import { QUIZ_IMAGE_SEARCH_HINT_MAX_LENGTH } from 'quizzer-lib';
import { messageState } from '@/atoms/Message';
import { Button } from '@/components/ui-elements/button/Button';
import { DialogModal } from '@/components/ui-parts/dialogModal/DialogModal';
import { importImageOfQuizAPI, searchImageCandidatesOfQuizAPI } from '@/utils/api-wrapper';

interface ImageSearchModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  quizId: number;
  // 既に画像が紐付いているか（タイトルを「差し替え」にし、上書きになることを伝える）
  hasImage?: boolean;
  // 画像を登録できた後に呼ぶ（保存したファイル名を渡す）
  onRegistered?: (fileName: string) => void;
}

type SearchState =
  | { status: 'searching' }
  | { status: 'done'; candidates: QuizImageCandidate[] }
  | { status: 'error'; message: string };

const SKELETON_COUNT = 9;

const hostnameOf = (url: string | null): string => {
  if (!url) return '';
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

// 候補の画像。サムネイルがなければ元画像を表示し、表示できなければその旨を出す
// （外部サイトの画像なので、リファラーを送らず読み込む。直リンク禁止のサイトでも表示されやすい）
const CandidateImage = ({
  candidate,
  alt,
  className
}: {
  candidate: QuizImageCandidate;
  alt: string;
  className: string;
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`${className} flex items-center justify-center text-xs text-gray-500 dark:text-gray-400`}>
        プレビューできません
      </div>
    );
  }
  return (
    // 外部サイトの画像でサイズも不定のため、next/imageではなく<img>を使う
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={candidate.thumbnail_url ?? candidate.image_url}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

// 問題文と答えからWebで画像の候補を探し、選んだ1枚を問題に登録するモーダル
// 開いた時に検索を始めるため、呼び出し側では開いている間だけ描画する
export const ImageSearchModal = ({ isOpen, setIsOpen, quizId, hasImage, onRegistered }: ImageSearchModalProps) => {
  const setMessage = useSetRecoilState(messageState);
  const [hint, setHint] = useState('');
  const [searchState, setSearchState] = useState<SearchState>({ status: 'searching' });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  // 検索中に再検索・クローズされた時、古い検索の結果を反映しないための番号
  const searchIdRef = useRef(0);

  const search = useCallback(
    async (searchHint: string) => {
      const searchId = ++searchIdRef.current;
      setSearchState({ status: 'searching' });
      setSelectedIndex(null);
      const result = await searchImageCandidatesOfQuizAPI({
        searchImageCandidatesRequestData: { quiz_id: quizId, hint: searchHint }
      });
      if (searchId !== searchIdRef.current) return;
      if (result.isSuccess && result.result) {
        const { candidates } = result.result as SearchImageCandidatesOfQuizAPIResponseDto;
        setSearchState({ status: 'done', candidates });
      } else {
        setSearchState({ status: 'error', message: result.message?.message ?? '画像の検索に失敗しました' });
      }
    },
    [quizId]
  );

  // 開いた時に追加指示なしで検索する。閉じたら以降の結果は捨てる
  useEffect(() => {
    void search('');
    return () => {
      // searchIdRefはDOMではなく検索の番号なので、クリーンアップ時点の値を進めて実行中の検索を無効にする
      // eslint-disable-next-line react-hooks/exhaustive-deps
      searchIdRef.current++;
    };
  }, [search]);

  const candidates = searchState.status === 'done' ? searchState.candidates : [];
  const selected = selectedIndex === null ? null : candidates[selectedIndex];

  const handleRegister = async () => {
    if (!selected) return;
    setIsRegistering(true);
    setMessage({ message: '画像を登録しています...', messageColor: '#d3d3d3', isDisplay: true });
    const result = await importImageOfQuizAPI({
      importImageRequestData: {
        quiz_id: quizId,
        image_url: selected.image_url,
        thumbnail_url: selected.thumbnail_url,
        signature: selected.signature
      }
    });
    setIsRegistering(false);
    setMessage(result.message);
    if (result.isSuccess && result.result) {
      setIsOpen(false);
      onRegistered?.((result.result as ImportImageOfQuizAPIResponseDto).fileName);
    }
    // 失敗（取得できない画像など）の時は開いたままにして、別の候補を選べるようにする
  };

  const isSearching = searchState.status === 'searching';

  return (
    <DialogModal
      isOpen={isOpen}
      setIsOpen={isRegistering ? undefined : setIsOpen}
      maxWidthClassName="max-w-3xl"
      title={hasImage ? '画像を探して差し替え' : '画像を探して登録'}
      actions={
        <>
          <Button
            label="キャンセル"
            attr="no-margin"
            variant="outlined"
            disabled={isRegistering}
            onClick={() => setIsOpen(false)}
          />
          <Button
            label={isRegistering ? '登録中...' : 'この画像で登録'}
            attr="no-margin"
            variant="contained"
            color="primary"
            disabled={!selected || isRegistering}
            onClick={handleRegister}
          />
        </>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto !pr-1">
        <form
          className="flex gap-2 items-start"
          onSubmit={(e) => {
            e.preventDefault();
            void search(hint);
          }}
        >
          <MuiTextField
            label="追加指示（任意）"
            placeholder="例: 外観写真で / 地図で / 意味を表す図解"
            size="small"
            fullWidth
            value={hint}
            disabled={isSearching || isRegistering}
            onChange={(e) => setHint(e.target.value)}
            inputProps={{ maxLength: QUIZ_IMAGE_SEARCH_HINT_MAX_LENGTH }}
          />
          <Button
            label="再検索"
            attr="no-margin"
            variant="outlined"
            sx={{ whiteSpace: 'nowrap', flexShrink: 0, height: 40 }}
            disabled={isSearching || isRegistering}
            onClick={() => void search(hint)}
          />
        </form>
        {hasImage && (
          <Typography variant="body2" className="!mt-2 text-gray-600 dark:text-gray-300">
            登録すると、今の画像からこの画像に差し替わります。
          </Typography>
        )}

        {isSearching && (
          <>
            <Typography variant="body2" className="!mt-3" role="status">
              AIが画像を探しています…（15秒ほどかかることがあります）
            </Typography>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 !mt-2">
              {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <Skeleton key={i} variant="rectangular" className="!h-[120px] rounded" />
              ))}
            </div>
          </>
        )}

        {searchState.status === 'error' && (
          <Typography variant="body2" color="error" className="!mt-3" role="alert">
            {searchState.message}
          </Typography>
        )}

        {searchState.status === 'done' && candidates.length === 0 && (
          <Typography variant="body2" className="!mt-3" role="status">
            画像の候補が見つかりませんでした。再検索するか、追加指示を変えてください。
          </Typography>
        )}

        {candidates.length > 0 && (
          <>
            <Typography variant="body2" className="!mt-3 text-gray-600 dark:text-gray-300">
              登録する画像を1枚選んでください。人物などは別人の写真が混ざることがあるので、出典も確認してください。
            </Typography>
            {/* PCでは選んだ画像を一覧の右に（スクロールしても見えるよう固定）、スマホでは一覧の上に出す */}
            <div className="flex flex-col sm:flex-row gap-3 !mt-2">
              <div
                className="sm:flex-1 order-2 sm:order-1 grid grid-cols-2 sm:grid-cols-3 gap-2 content-start"
                role="list"
              >
                {candidates.map((candidate, index) => {
                  const isSelected = index === selectedIndex;
                  const label = candidate.caption ?? `候補${index + 1}`;
                  return (
                    <div role="listitem" key={candidate.image_url}>
                      {/* ButtonBaseは枠線を0にするので、枠線・背景は!付きで指定する */}
                      <ButtonBase
                        className={`!flex !flex-col w-full !items-stretch text-left !rounded !border-2 !border-solid !p-1 ${
                          isSelected ? '!border-blue-500 !bg-blue-50 dark:!bg-blue-900/30' : '!border-transparent'
                        }`}
                        aria-pressed={isSelected}
                        aria-label={`${label}（${hostnameOf(candidate.source_url) || '出典不明'}）`}
                        disabled={isRegistering}
                        onClick={() => setSelectedIndex(index)}
                      >
                        <CandidateImage
                          candidate={candidate}
                          alt=""
                          className="w-full h-[110px] object-contain bg-gray-100 dark:bg-gray-700 rounded"
                        />
                        <span className="text-xs line-clamp-2 !mt-1">{candidate.caption ?? '（説明なし）'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {hostnameOf(candidate.source_url) || '出典不明'}
                        </span>
                      </ButtonBase>
                    </div>
                  );
                })}
              </div>

              <div className="order-1 sm:order-2 sm:w-[240px] sm:shrink-0 sm:sticky sm:top-0 self-start w-full !p-2 border rounded border-gray-300 dark:border-gray-600">
                <Typography variant="subtitle2" component="h3">
                  選択中の画像
                </Typography>
                {selected ? (
                  <>
                    <CandidateImage
                      key={selected.image_url}
                      candidate={selected}
                      alt={selected.caption ?? '選択中の画像'}
                      className="w-full max-h-[140px] sm:max-h-[200px] object-contain !my-2"
                    />
                    {selected.caption && <Typography variant="body2">{selected.caption}</Typography>}
                    {selected.source_url && (
                      <Typography variant="body2">
                        出典：
                        <a
                          href={selected.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-600 dark:text-blue-400 break-all"
                        >
                          {hostnameOf(selected.source_url) || selected.source_url}
                        </a>
                      </Typography>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" className="!mt-1 text-gray-500 dark:text-gray-400">
                    画像を選ぶと、ここに大きく表示されます
                  </Typography>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DialogModal>
  );
};
