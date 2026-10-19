import { IconButton } from '@mui/material';
import type { GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';

export const columns = [
  {
    field: 'quiz_num',
    headerName: '番号',
    sortable: true,
    type: 'number',
    width: 75
  },
  {
    field: 'edit',
    headerName: '編集',
    sortable: false,
    width: 50,
    // TODO anyではないd型
    renderCell: (params: GridRenderCellParams<any>) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      return (
        <IconButton
          aria-label={params.value}
          onClick={() => {
            void router.push({
              pathname: '/quizzer/editQuiz',
              query: { file_num: params.row.file_num, quiz_num: params.row.quiz_num }
            });
          }}
        >
          <EditIcon />
        </IconButton>
      );
    }
  },
  {
    field: 'checked',
    headerName: '✅',
    sortable: false,
    width: 50,
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
  },
  {
    field: 'accuracy_rate',
    headerName: '正解率(%)',
    sortable: true,
    type: 'number',
    width: 100,
    renderCell: (params: GridRenderCellParams<any>) => {
      const accuracyRate = params.value as number;
      // 0~100の値を0~1に正規化
      const normalized = Math.max(0, Math.min(100, accuracyRate || 0)) / 100;

      // 背景色を計算: 0に近いほど黒に近い、100に近いほど黄緑色
      // より滑らかなグラデーションを作成
      let red: number;
      let green: number;
      let blue: number;

      if (normalized < 0.5) {
        // 0~50%: 黒から赤へのグラデーション
        const t = normalized * 2; // 0~1に変換
        red = Math.round(100 + 80 * t); // 100~180
        green = Math.round(20 * t); // 0~20
        blue = Math.round(20 * t); // 0~20
      } else {
        // 50~100%: 赤から黄緑へのグラデーション
        const t = (normalized - 0.5) * 2; // 0~1に変換
        red = Math.round(180 - 100 * t); // 180~80
        green = Math.round(20 + 235 * t); // 20~255
        blue = Math.round(20 - 20 * t); // 20~0
      }

      // テキストの色を決定（背景が暗い場合は白、明るい場合は黒）
      const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
      const textColor = brightness > 128 ? '#000000' : '#ffffff';

      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `rgb(${red}, ${green}, ${blue})`,
            color: textColor,
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          {accuracyRate !== null && accuracyRate !== undefined ? `${accuracyRate.toFixed(1)}%` : '-'}
        </div>
      );
    }
  },
  {
    field: 'explanation',
    headerName: '解説',
    sortable: false,
    type: 'string',
    width: 300
  },
  {
    field: 'img_file',
    headerName: '画像ファイル',
    sortable: false,
    type: 'string',
    width: 150
  }
];
