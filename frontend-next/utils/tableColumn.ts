// 格言検索テーブルの列定義
export const searchSayingColumns = [
    {
      field: 'id',
      headerName: 'ID',
      sortable: true,
      width: 10
    },
    {
      field: 'saying',
      headerName: '格言',
      sortable: false,
      width: 300,
      type: 'string'
    },
    {
      field: 'explanation',
      headerName: '説明',
      sortable: false,
      width: 400
    },
    {
      field: 'name',
      headerName: '本',
      sortable: false,
      width: 100
    }
  ];