#!/bin/bash

#########################################################
## 行数集計の対象ファイルを1行1ファイルで出力するシェル
## update_avg_lines.sh・top_lines.sh から使う（集計対象の判定をここにまとめる）
#########################################################

# どこから実行してもリポジトリルートを基準にする
cd "$(dirname "$0")/.." || exit 1

# 集計から除くファイル（パスにこの文字列を含むもの）
# .gitignore で除外されるファイルは git ls-files の時点で除かれるので、ここには書かない
IGNORE_DIRS=("/." "public/" ".json" ".md" "./backend-nest/test/" ".test." "spec.ts" "e2e" ".stories.tsx" ".yaml" "prisma/" )

# git管理下のファイルと、未追跡だが.gitignoreで除外されていないファイルを対象に、無視リストを適用する
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
