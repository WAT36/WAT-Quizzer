// 指定されたidの<input>要素のvalueを空にする関数
export const clearInputValuesByIds = (ids: string[]): void => {
  ids.forEach((id) => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (input && input.tagName === 'INPUT') {
      input.value = '';
    }
  });
};

// 文字列をファイルとして保存させる（ダウンロード用の<a>を一時的に作ってクリックする）
export const downloadTextFile = (text: string, filename: string, type = 'text/csv'): void => {
  const url = window.URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
