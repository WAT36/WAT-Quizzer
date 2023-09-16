// サイドバーのコンテンツ
export const sideBarContents = [
  { name: 'Top', link: '/englishBot' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'Add Words', link: '/englishBot/addWord' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'Dictionary', link: '/englishBot/dictionary' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'Detail Word', link: '/englishBot/detailWord' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'Add Example', link: '/englishBot/addExample' + process.env.NEXT_PUBLIC_URL_END }
];

// サイドバー開閉
export const toggleDrawer =
  (isOpen: boolean, setSidebarState: React.Dispatch<React.SetStateAction<{ open: boolean }>>) =>
  (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || 'Shift')) {
      return;
    }

    setSidebarState({ open: isOpen });
  };
