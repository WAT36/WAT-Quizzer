// サイドバーのコンテンツ
export const sideBarContents = [
  { name: 'トップ', link: process.env.NEXT_PUBLIC_URL_END },
  { name: '問題出題', link: '/quizzer' + process.env.NEXT_PUBLIC_URL_END },
  { name: '問題追加', link: '/quizzer/addQuiz' + process.env.NEXT_PUBLIC_URL_END },
  { name: '問題編集', link: '/quizzer/editQuiz' + process.env.NEXT_PUBLIC_URL_END },
  { name: '問題検索', link: '/quizzer/searchQuiz' + process.env.NEXT_PUBLIC_URL_END },
  { name: '問題削除', link: '/quizzer/deleteQuiz' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'カテゴリ別正解率表示', link: '/quizzer/accuracyRateGraph' + process.env.NEXT_PUBLIC_URL_END },
  { name: '画像アップロード', link: '/quizzer/imageUpload' + process.env.NEXT_PUBLIC_URL_END }
];

// サイドバー開閉
export const toggleDrawer = (isOpen: boolean, setSidebarState: any) => (event: any) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || 'Shift')) {
    return;
  }

  setSidebarState({ open: isOpen });
};
