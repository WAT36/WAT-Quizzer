import { atom } from 'recoil';
import { MessageState } from '../../interfaces/state';

export const messageState = atom({
  key: 'message',
  default: {
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  } as MessageState
});
