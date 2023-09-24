import { EnglishService } from './english.service';
import * as Dao from '../../lib/db/dao';
jest.mock('../../lib/db/dao');

describe('EnglishService', () => {
  let englishService: EnglishService;

  beforeEach(() => {
    englishService = new EnglishService();
  });
});
