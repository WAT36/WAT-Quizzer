export const columns = [
  {
    field: 'id',
    headerName: 'ID',
    sortable: true,
    width: 100
  },
  {
    field: 'name',
    headerName: '単語',
    sortable: true,
    width: 300
  }
];

export const meanColumns = [
  {
    field: 'id',
    headerName: 'ID',
    sortable: true,
    width: 100
  },
  {
    field: 'wordmean_id',
    headerName: '単語内意味ID',
    sortable: true,
    width: 100
  },
  {
    field: 'partsofspeech',
    headerName: '品詞',
    sortable: false,
    width: 100
  },
  {
    field: 'source_name',
    headerName: '出典',
    sortable: false,
    width: 100
  },
  {
    field: 'meaning',
    headerName: '意味',
    sortable: false,
    width: 300
  }
];
