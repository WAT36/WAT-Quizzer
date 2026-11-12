#!/bin/bash

#########################################################
## 行数集計の対象ファイルのうち、行数が多い順に上位を出力するシェル
## 使い方: bash tools/top_lines.sh [件数(省略時30)]
#########################################################

# どこから実行してもリポジトリルートを基準にする
cd "$(dirname "$0")/.." || exit 1

limit="${1:-30}"
if ! [[ "$limit" =~ ^[1-9][0-9]*$ ]]; then
    echo "件数は1以上の整数で指定してください: $limit" >&2
    exit 1
fi

echo "行数の多いファイル 上位${limit}件"
echo "順位  行数  ファイル"

bash tools/list_target_files.sh | while read -r file; do
    printf '%s\t%s\n' "$(wc -l <"$file" | tr -d ' ')" "${file#./}"
done | sort -t $'\t' -k1,1nr -k2,2 | head -n "$limit" |
    awk -F '\t' '{ printf "%4d %6d  %s\n", NR, $1, $2 }'
