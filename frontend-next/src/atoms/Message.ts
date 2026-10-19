import { atom } from 'recoil';
import type { Message } from 'quizzer-lib';

export const messageState = atom({
  key: 'message',
  default: {
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  } as Message
});
