export type SideBarModeType = 'quizzer' | 'englishBot' | 'settings' | 'top';

interface SideBarType {
  bgColor: string;
  contents: {
    name: string;
    link: string;
  }[];
}

const urlEnd = process.env.NEXT_PUBLIC_URL_END || '';
export const sidebar: { [key: string]: SideBarType } = {
  quizzer: {
    // 元は#0077B6。白文字とのコントラスト比がWCAG AA基準(4.5:1)をわずかに下回るため微調整
    bgColor: '#006494',
    contents: [
      { name: 'トップ', link: '/quizzer' + urlEnd },
      { name: '問題出題', link: '/quizzer/getQuiz' + urlEnd },
      { name: '問題追加', link: '/quizzer/addQuiz' + urlEnd },
      { name: '問題編集', link: '/quizzer/editQuiz' + urlEnd },
      { name: '問題検索', link: '/quizzer/searchQuiz' + urlEnd },
      { name: '問題削除', link: '/quizzer/deleteQuiz' + urlEnd },
      { name: 'カテゴリ別正解率表示', link: '/quizzer/accuracyRateGraph' + urlEnd },
      { name: '画像アップロード', link: '/quizzer/imageUpload' + urlEnd },
      { name: '設定', link: '/quizzer/settings' + urlEnd }
    ]
  },
  englishBot: {
    bgColor: 'midnightblue',
    contents: [
      { name: 'Top', link: '/englishBot' + urlEnd },
      { name: 'Add Words', link: '/englishBot/addWord' + urlEnd },
      { name: 'Dictionary', link: '/englishBot/dictionary' + urlEnd },
      { name: 'Add Example', link: '/englishBot/addExample' + urlEnd },
      { name: 'Test Words', link: '/englishBot/testWord' + urlEnd }
    ]
  },
  settings: {
    // 元は#0288d1(MUIデフォルトinfo色)。白文字とのコントラスト比がWCAG AA基準(4.5:1)を下回るため調整
    bgColor: '#01579b',
    contents: []
  },
  top: {
    bgColor: 'black',
    contents: []
  }
};
