// サイドバーのコンテンツ
export const sideBarContents = [
  { name: 'トップ', link: '/index.html' },
  { name: '問題出題', link: '/quizzer/index.html' },
  { name: '問題追加', link: '/quizzer/addQuiz/index.html' },
  { name: '問題編集', link: '/quizzer/editQuiz/index.html' },
  { name: '問題検索', link: '/quizzer/serachQuiz/index.html' },
  { name: '問題削除', link: '/quizzer/deleteQuiz/index.html' },
  { name: 'カテゴリ別正解率表示', link: '/quizzer/accuracyRateGraph/index.html' },
  { name: '画像アップロード', link: '/quizzer/imageUpload/index.html' }
];

// サイドバー開閉
export const toggleDrawer = (isOpen: boolean, setSidebarState: any) => (event: any) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || 'Shift')) {
    return;
  }

  setSidebarState({ open: isOpen });
};
