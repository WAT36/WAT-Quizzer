const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export const pullDownMenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
};

// プルダウンの「選択なし」「その他」の値
export const PULLDOWN_NONE_VALUE = -1;
export const PULLDOWN_OTHER_VALUE = -2;
