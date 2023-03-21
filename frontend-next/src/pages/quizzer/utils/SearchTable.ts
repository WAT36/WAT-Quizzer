export const columns = [
  {
    field: 'id',
    headerName: 'ID',
    sortable: false,
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
  },
  {
    field: 'accuracy_rate',
    headerName: '正解率',
    sortable: true,
    width: 150
  }
];
