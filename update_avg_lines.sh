#!/bin/bash

#########################################################
## 全ファイルの行数平均値を取得し記録するシェル
## push前に自動で走るように.git/hooks/pre-pushに書き込むのが良い
#########################################################

echo "全ファイル平均行数計算 開始"

# 無視するディレクトリ
# TODO .gitignoreから読みたい
IGNORE_DIRS=("node_modules/" "dist/" "/." "public/" ".log" "d.ts" "/out/" "/storybook-static" "/database-old" "/file" "/yaml" "cdk.out" ".json" ".md" "test" "spec.ts" "e2e" ".stories.tsx")

# 全ファイルの行数をカウントする関数
count_lines() {
    local file="$1"
    wc -l <"$file" | tr -d ' ' # 行数を取得
}

# 指定したディレクトリ以下のすべてのファイルを取得（無視リスト適用）
get_all_files() {
    find . -type f | while read -r file; do
        # 無視リストに含まれる値がパスにあればスキップ
        for ignore in "${IGNORE_DIRS[@]}"; do
            if [[ "$file" == *"$ignore"* ]]; then
                continue 2 # 次のファイルへ
            fi
        done
        echo "$file"
    done
}

# すべてのファイルの行数を計算
total_lines=0
file_count=0

while read -r file; do
    lines=$(count_lines "$file")
    total_lines=$((total_lines + lines))
    file_count=$((file_count + 1))
done < <(get_all_files)

# 平均行数登録バッチで登録（.env はリポジトリルートのものを読むため cwd はルートのまま batch の ts-node を使う）
./batch/node_modules/.bin/ts-node batch/src/tools/avg_line.register.ts ${total_lines} ${file_count}
