import { Link } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';

export const searchedDetailColumns = [
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
    width: 300,
    // TODO  undefinedで良いのか
    renderCell: (params: GridRenderCellParams) => (
      <Link
        tabIndex={params.id as number}
        href={'/englishBot/detailWord/' + params.id + process.env.NEXT_PUBLIC_URL_END}
      >
        {String(params.value)}
      </Link>
    )
  },
  {
    field: 'meaning',
    headerName: '意味(先頭のみ表示)',
    sortable: false,
    width: 400
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
    field: 'meaning',
    headerName: '意味',
    sortable: false,
    width: 300
  }
];
