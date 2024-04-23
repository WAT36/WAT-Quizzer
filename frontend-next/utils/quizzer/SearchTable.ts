export const columns = [
  {
    field: 'quiz_num',
    headerName: 'ID',
    sortable: true,
    width: 75
  },
  {
    field: 'checked',
    headerName: '✅',
    sortable: false,
    width: 75,
    type: 'boolean'
  },
  {
    field: 'quiz_sentense',
    headerName: '問題',
    sortable: false,
    width: 300
  },
  {
    field: 'answer',
    headerName: '答え',
    sortable: false,
    width: 300
  },
  {
    field: 'category',
    headerName: 'カテゴリ',
    sortable: false,
    width: 250
  }
];
