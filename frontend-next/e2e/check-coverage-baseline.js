// coverage-summary.json(json-summary, Istanbul形式)から、
// 1. GitHub ActionsのJob Summaryに載せる短いカバレッジ要約
// 2. coverage-baseline.jsonに記録した基準値を下回っていないかの非ブロッキングな警告
// をまとめて出力する。CIをブロックしたくないため、regressionがあっても常にexit 0。
const fs = require('fs');
const path = require('path');

const SUMMARY_PATH = path.resolve(__dirname, '../coverage-report/coverage-summary.json');
const BASELINE_PATH = path.resolve(__dirname, './coverage-baseline.json');
// baselineからこの割合(pt)以上下回った場合のみ警告する(誤差レベルの揺れで警告しないため)
const TOLERANCE_PT = 1;
const SRC_PREFIX = '[project]/frontend-next/';

function main() {
  if (!fs.existsSync(SUMMARY_PATH)) {
    console.log(`coverage-summary.json not found at ${SUMMARY_PATH}, skipping coverage summary.`);
    return;
  }

  const summary = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf-8'));
  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf-8'));

  const total = summary.total;
  const currentPct = total.lines.pct;
  const baselinePct = baseline.lines;
  const diff = currentPct - baselinePct;

  const zeroCoveredFiles = Object.entries(summary)
    .filter(([key, value]) => key !== 'total' && value.lines.pct === 0)
    .map(([key]) => (key.startsWith(SRC_PREFIX) ? key.slice(SRC_PREFIX.length) : key));

  const lines = [];
  lines.push('### E2Eカバレッジ (src/配下、lines基準)');
  lines.push('');
  lines.push('| 指標 | Coverage % | Covered | Total |');
  lines.push('| :--- | ---------: | ------: | ----: |');
  lines.push(`| Lines | ${total.lines.pct}% | ${total.lines.covered} | ${total.lines.total} |`);
  lines.push(`| Statements | ${total.statements.pct}% | ${total.statements.covered} | ${total.statements.total} |`);
  lines.push(`| Branches | ${total.branches.pct}% | ${total.branches.covered} | ${total.branches.total} |`);
  lines.push(`| Functions | ${total.functions.pct}% | ${total.functions.covered} | ${total.functions.total} |`);
  lines.push('');

  if (zeroCoveredFiles.length > 0) {
    lines.push(`<details><summary>0%カバレッジのファイル (${zeroCoveredFiles.length}件)</summary>`);
    lines.push('');
    zeroCoveredFiles.forEach((file) => lines.push(`- ${file}`));
    lines.push('');
    lines.push('</details>');
    lines.push('');
  }

  lines.push(`基準値(lines): ${currentPct}% / ${baselinePct}% (差分: ${diff >= 0 ? '+' : ''}${diff.toFixed(2)}pt)`);

  if (diff < -TOLERANCE_PT) {
    const message = `E2Eカバレッジ(lines)が基準値を下回りました: ${currentPct}% < ${baselinePct}% (${diff.toFixed(2)}pt)`;
    console.log(`::warning::${message}`);
    lines.push(`- ⚠️ ${message}`);
    lines.push('- カバレッジを追加するか、意図した変更であれば `e2e/coverage-baseline.json` を更新してください。');
  } else {
    lines.push('- ✅ 基準値を下回っていません。');
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join('\n')}\n`);
  } else {
    console.log(lines.join('\n'));
  }
}

main();
