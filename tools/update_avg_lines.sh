#!/bin/bash

#########################################################
## 全ファイルの行数平均値を取得し記録するシェル
## push前に .githooks/pre-push から自動で実行される
#########################################################

# どこから実行してもリポジトリルートを基準に集計する（.env もルートのものを読む）
cd "$(dirname "$0")/.." || exit 1

echo "全ファイル平均行数計算 開始"

# 全ファイルの行数をカウントする関数
count_lines() {
    local file="$1"
    wc -l <"$file" | tr -d ' ' # 行数を取得
}

# すべてのファイルの行数を計算
total_lines=0
file_count=0

while read -r file; do
    lines=$(count_lines "$file")
    total_lines=$((total_lines + lines))
    file_count=$((file_count + 1))
done < <(bash tools/list_target_files.sh) # 集計対象の判定は list_target_files.sh にまとめている

# 平均行数登録バッチで登録（.env はリポジトリルートのものを読むため cwd はルートのまま batch の ts-node を使う）
./batch/node_modules/.bin/ts-node batch/src/tools/avg_line.register.ts ${total_lines} ${file_count}
