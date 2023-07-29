// サイドバーのコンテンツ
const urlEnd = process.env.NEXT_PUBLIC_URL_END || '';
export const sideBarContents = [
  { name: 'トップ', link: urlEnd },
  { name: '問題出題', link: '/quizzer' + urlEnd },
  { name: '問題追加', link: '/quizzer/addQuiz' + urlEnd },
  { name: '問題編集', link: '/quizzer/editQuiz' + urlEnd },
  { name: '問題検索', link: '/quizzer/searchQuiz' + urlEnd },
  { name: '問題削除', link: '/quizzer/deleteQuiz' + urlEnd },
  { name: 'カテゴリ別正解率表示', link: '/quizzer/accuracyRateGraph' + urlEnd },
  { name: '画像アップロード', link: '/quizzer/imageUpload' + urlEnd }
];

// サイドバー開閉
export const toggleDrawer = (isOpen: boolean, setSidebarState: any) => (event: any) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || 'Shift')) {
    return;
  }

  setSidebarState({ open: isOpen });
};
