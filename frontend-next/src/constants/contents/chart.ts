// Quizzer 問題ファイルごとの正解率不正解率の円グラフ
export const DOUGHNUT_CHART_LABEL = ['正解数', '不正解数', '未解答数'];
export const DOUGHNUT_CHART_COLOR = ['crimson', 'black', 'dimgray'];
export const DOUGHNUT_CHART_TITLE = '正答率分布';

//  Quizzer 正解率ヒストグラム
export const ACCRATE_HISTGRAM_LABEL = '問題数';
export const ACCRATE_HISTGRAM_COLOR = 'limegreen';
export const ACCRATE_HISTGRAM_TITLE = '正解率ヒストグラム';

//  Quizzer 回答履歴のグラフ
export const ANSWER_LOG_HISTGRAM_LABEL = ['解答数', '正解率'];
export const ANSWER_LOG_HISTGRAM_COLOR = ['royalblue', 'limegreen'];

//  Quizzer 回答履歴のグラフの日付単位の選択肢
export const DATE_UNIT_OPTION = [
  { value: 'day', label: '日' },
  { value: 'week', label: '週' },
  { value: 'month', label: '月' }
];

//  Quizzer 出題セッション終了後の結果グラフ
export const SESSION_RESULT_DOUGHNUT_LABEL = ['正解', '不正解'];
export const SESSION_RESULT_DOUGHNUT_COLOR = ['crimson', 'dimgray'];
export const SESSION_RESULT_DOUGHNUT_TITLE = '今回の正解・不正解';
export const SESSION_RESULT_CATEGORY_TITLE = 'カテゴリ別正解率(%)';
export const SESSION_RESULT_CATEGORY_LABEL = '正解率(%)';
// 得意・苦手・その他（判定対象外含む）の棒の色
export const SESSION_RESULT_CATEGORY_COLOR = { strong: 'limegreen', weak: 'orange', other: 'royalblue' };
