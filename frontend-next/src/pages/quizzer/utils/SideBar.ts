// サイドバーのコンテンツ
export const sideBarContents = [
  { name: 'トップ', link: '/' },
  { name: '問題出題', link: '/quizzer' },
  { name: '問題追加', link: '/quizzer/addQuiz' },
  { name: '問題編集', link: '/quizzer/editQuiz' },
  { name: '問題検索', link: '/quizzer/serachQuiz' },
  { name: '問題削除', link: '/quizzer/deleteQuiz' },
  { name: 'カテゴリ別正解率表示', link: '/' },
  { name: '画像アップロード', link: '/' }
];

// サイドバー開閉
export const toggleDrawer = (isOpen: boolean, setSidebarState: any) => (event: any) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || 'Shift')) {
    return;
  }

  setSidebarState({ open: isOpen });
};
