// サイドバーのコンテンツ
export const sideBarContents = [
  { name: 'Top', link: '/englishBot' },
  { name: 'Add Words', link: '/englishBot/addWord' },
  { name: 'Dictionary', link: '' }
];

// サイドバー開閉
export const toggleDrawer = (isOpen: boolean, setSidebarState: any) => (event: any) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || 'Shift')) {
    return;
  }

  setSidebarState({ open: isOpen });
};
