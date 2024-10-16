export const columns = [
  {
    field: 'id',
    headerName: 'ID',
    sortable: true,
    type: 'number',
    width: 0
  },
  {
    field: 'quiz_num',
    headerName: '番号',
    sortable: true,
    type: 'number',
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
    field: 'format_name',
    headerName: '種別',
    sortable: false,
    width: 75,
    type: 'string'
  },
  {
    field: 'quiz_sentense',
    headerName: '問題',
    sortable: false,
    type: 'string',
    width: 300
  },
  {
    field: 'answer',
    headerName: '答え',
    sortable: false,
    type: 'string',
    width: 300
  },
  {
    field: 'category',
    headerName: 'カテゴリ',
    sortable: false,
    type: 'string',
    width: 250
  }
];
