// サイドバーのコンテンツ
export const sideBarContents = [
  { name: 'Top', link: '/englishBot/index.html' },
  { name: 'Add Words', link: '/englishBot/addWord/index.html' },
  { name: 'Dictionary', link: '/englishBot/dictionary/index.html' }
];

// サイドバー開閉
export const toggleDrawer = (isOpen: boolean, setSidebarState: any) => (event: any) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || 'Shift')) {
    return;
  }

  setSidebarState({ open: isOpen });
};
