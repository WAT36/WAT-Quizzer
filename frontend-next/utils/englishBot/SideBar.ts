// サイドバーのコンテンツ
export const sideBarContents = [
  { name: 'Top', link: '/englishBot' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'Add Words', link: '/englishBot/addWord' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'Dictionary', link: '/englishBot/dictionary' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'Detail Word', link: '/englishBot/detailWord' + process.env.NEXT_PUBLIC_URL_END }
];

// サイドバー開閉
export const toggleDrawer = (isOpen: boolean, setSidebarState: any) => (event: any) => {
  if (event.type === 'keydown' && (event.key === 'Tab' || 'Shift')) {
    return;
  }

  setSidebarState({ open: isOpen });
};
