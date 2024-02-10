import { ScrapeService } from './scrape.service';
jest.mock('../../lib/db/dao');
import puppeteer from 'puppeteer';

describe('ScrapeService', () => {
  let scrapeService: ScrapeService;

  beforeEach(() => {
    scrapeService = new ScrapeService();
  });

  // ベストイベント取得 異常系
  it('getBestEvent - NG', async () => {
    jest.spyOn(puppeteer, 'launch').mockImplementation(() => {
      throw Error('error test by jest.');
    });
    await expect(scrapeService.getBestEvent()).rejects.toMatchObject({
      message: 'error test by jest.',
    });
  });
});
