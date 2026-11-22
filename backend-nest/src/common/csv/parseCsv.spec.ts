import { parseCsv } from './parseCsv';

const toFile = (text: string) =>
  ({ buffer: Buffer.from(text, 'utf-8') }) as Express.Multer.File;

describe('parseCsv', () => {
  it('各値の前後の空白を除いて、行ごとの文字列配列にする', async () => {
    const result = await parseCsv(toFile(' a , b \nc,d\n'));
    expect(result.data).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('NUL文字(\\u0000)は取り除く（PostgreSQLのテキストに保存できないため）', async () => {
    const result = await parseCsv(toFile('問\u0000題,答\u0000え\u0000\n'));
    expect(result.data).toEqual([['問題', '答え']]);
  });
});
