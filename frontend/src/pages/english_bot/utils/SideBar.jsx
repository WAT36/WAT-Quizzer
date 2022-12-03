
// サイドバーのコンテンツ
export const sideBarContents = [
    { name: 'Top', link: '/english/top' },
    { name: 'Add Words', link: '/english/add' },
    { name: 'Dictionary', link: '/english/dictionary' },
]

// サイドバー開閉
export const toggleDrawer =
    (isOpen, setSidebarState) =>
        (event) => {
            if (
                event.type === 'keydown' &&
                (event.key === 'Tab' || 'Shift')
            ) {
                return;
            }

            setSidebarState({ open: isOpen });
        };