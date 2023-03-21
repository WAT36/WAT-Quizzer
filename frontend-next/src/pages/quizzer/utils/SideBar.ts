// サイドバーのコンテンツ
export const sideBarContents = [
  { name: 'トップ', link: '/top' },
  { name: '問題出題', link: '/selectquiz' },
  { name: '問題追加', link: '/addquiz' },
  { name: '問題編集', link: '/editquiz' },
  { name: '問題検索', link: '/searchquiz' },
  { name: '問題削除', link: '/deletequiz' },
  { name: 'カテゴリ別正解率表示', link: '/accuracyrategraph' },
  { name: '画像アップロード', link: '/imageupload' }
];

// サイドバー開閉
export const toggleDrawer = (isOpen: boolean, setSidebarState: any) => (event: any) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || 'Shift')) {
    return;
  }

  setSidebarState({ open: isOpen });
};
