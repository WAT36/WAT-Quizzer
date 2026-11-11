#!/bin/bash

#########################################################
## 全ファイルの行数平均値を取得し記録するシェル
## push前に .githooks/pre-push から自動で実行される
#########################################################

# どこから実行してもリポジトリルートを基準に集計する（.env もルートのものを読む）
cd "$(dirname "$0")/.." || exit 1

echo "全ファイル平均行数計算 開始"

# 集計から除くファイル（パスにこの文字列を含むもの）
# .gitignore で除外されるファイルは git ls-files の時点で除かれるので、ここには書かない
IGNORE_DIRS=("/." "public/" ".json" ".md" "./backend-nest/test/" ".test." "spec.ts" "e2e" ".stories.tsx")

# 全ファイルの行数をカウントする関数
count_lines() {
    local file="$1"
    wc -l <"$file" | tr -d ' ' # 行数を取得
}

# 集計対象のファイルを取得する
# git管理下のファイルと、未追跡だが.gitignoreで除外されていないファイルを対象に、無視リストを適用する
get_all_files() {
    git -c core.quotePath=false ls-files --cached --others --exclude-standard | sed 's|^|./|' | while read -r file; do
        # 削除済みでまだコミットしていないファイルは数えない
        [[ -f "$file" ]] || continue
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
