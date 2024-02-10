import * as Dao from '../../lib/db/dao';
import { ScrapeService } from './scrape.service';
jest.mock('../../lib/db/dao');

describe('ScrapeService', () => {
  let scrapeService: ScrapeService;

  beforeEach(() => {
    scrapeService = new ScrapeService();
  });
});
