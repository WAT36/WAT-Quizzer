import * as Dao from '../../lib/db/dao';
import { SayingService } from './saying.service';
jest.mock('../../lib/db/dao');

describe('SayingService', () => {
  let sayingService: SayingService;

  beforeEach(() => {
    sayingService = new SayingService();
  });
});
