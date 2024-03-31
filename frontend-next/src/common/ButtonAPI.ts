import { GridRowsProp } from '@mui/x-data-grid';
import {
  EditQueryOfSaying,
  InputSayingState,
  MessageState,
  PullDownOptionState,
  QueryOfSearchWordState
} from '../../interfaces/state';
import { get, patch, post } from './API';
import { getBook } from './response';
import { GetSayingAPIResponseDto, ProcessingApiReponse, WordSearchAPIResponseDto } from 'quizzer-lib';

// 啓発本と格言系

interface AddBookButtonProps {
  bookName: string;
  attr?: string;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setBooklistoption?: React.Dispatch<React.SetStateAction<PullDownOptionState[]>>;
}

export const addBookAPI = async ({ bookName, setMessageStater, setBooklistoption }: AddBookButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setBooklistoption) {
    return;
  }
  if (!bookName || bookName === '') {
    setMessageStater({ message: 'エラー:本の名前を入力して下さい', messageColor: 'error', isDisplay: true });
    return;
  }

  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  await post(
    '/saying/book',
    {
      book_name: bookName
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessageStater({
          message: `新規ファイル「${bookName}」を追加しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error', isDisplay: true });
      }
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
  getBook(setMessageStater, setBooklistoption);
};

interface AddSayingButtonProps {
  inputSaying: InputSayingState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setInputSaying?: React.Dispatch<React.SetStateAction<InputSayingState>>;
}

export const addSayingAPI = async ({ inputSaying, setMessageStater, setInputSaying }: AddSayingButtonProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setInputSaying) {
    return;
  }

  if (!inputSaying.bookId || inputSaying.bookId === -1) {
    setMessageStater({ message: 'エラー:本名を選択して下さい', messageColor: 'error', isDisplay: true });
    return;
  } else if (!inputSaying.saying || inputSaying.saying === '') {
    setMessageStater({ message: 'エラー:格言を入力して下さい', messageColor: 'error', isDisplay: true });
    return;
  }

  setMessageStater({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
  await post(
    '/saying',
    {
      book_id: inputSaying.bookId,
      saying: inputSaying.saying,
      explanation: inputSaying.explanation
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200 || data.status === 201) {
        setMessageStater({
          message: `新規格言「${inputSaying}」を追加しました`,
          messageColor: 'success.light',
          isDisplay: true
        });
        setInputSaying({
          bookId: -1,
          saying: '',
          explanation: ''
        });
      } else {
        setMessageStater({ message: 'エラー:外部APIとの連携に失敗しました', messageColor: 'error', isDisplay: true });
      }
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
  //getBook(setMessageStater, setBooklistoption);
};

interface searchSayingAPIProps {
  queryOfSaying: string;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setSearchResult?: React.Dispatch<React.SetStateAction<GridRowsProp>>;
}

export const searchSayingAPI = async ({ queryOfSaying, setMessageStater, setSearchResult }: searchSayingAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setSearchResult) {
    return;
  }

  await get(
    '/saying/search',
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: [] = data.body as [];
        setSearchResult(res);
        setMessageStater({
          message: '　',
          messageColor: 'common.black',
          isDisplay: false
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    },
    {
      saying: queryOfSaying
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

interface getSayingAPIProps {
  id: number;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setEditQueryOfSaying?: React.Dispatch<React.SetStateAction<EditQueryOfSaying>>;
}

export const getSayingByIdAPI = async ({ id, setMessageStater, setEditQueryOfSaying }: getSayingAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setEditQueryOfSaying) {
    return;
  }

  if (isNaN(id) || id < 0) {
    setMessageStater({
      message: `エラー:入力したIDが不正です:${id}`,
      messageColor: 'error',
      isDisplay: true
    });
    return;
  }

  await get(
    `/saying/${id}`,
    (data: ProcessingApiReponse) => {
      if (data.status === 200 && data.body.length > 0) {
        const res: GetSayingAPIResponseDto[] = data.body as GetSayingAPIResponseDto[];
        setEditQueryOfSaying({
          id: id,
          saying: res[0].saying,
          explanation: res[0].explanation
        });
        setMessageStater({
          message: '格言を取得しました',
          messageColor: 'success.light',
          isDisplay: true
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setEditQueryOfSaying({
          id: -1,
          saying: ''
        });
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else {
        setEditQueryOfSaying({
          id: -1,
          saying: ''
        });
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    },
    {}
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setEditQueryOfSaying({
      id: -1,
      saying: ''
    });
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
};

interface editSayingAPIProps {
  editQueryOfSaying: EditQueryOfSaying;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
  setEditQueryOfSaying?: React.Dispatch<React.SetStateAction<EditQueryOfSaying>>;
}

export const editSayingAPI = async ({
  editQueryOfSaying,
  setMessageStater,
  setEditQueryOfSaying
}: editSayingAPIProps) => {
  // 設定ステートない場合はreturn(storybook表示用に設定)
  if (!setMessageStater || !setEditQueryOfSaying) {
    return;
  }

  await patch(
    '/saying',
    {
      id: editQueryOfSaying.id,
      saying: editQueryOfSaying.saying,
      explanation: editQueryOfSaying.explanation
    },
    (data: ProcessingApiReponse) => {
      if (data.status === 200) {
        setMessageStater({
          message: 'Success!! 編集に成功しました',
          messageColor: 'success.light',
          isDisplay: true
        });
      } else if (data.status === 404 || data.body?.length === 0) {
        setMessageStater({
          message: 'エラー:条件に合致するデータはありません',
          messageColor: 'error',
          isDisplay: true
        });
      } else {
        setMessageStater({
          message: 'エラー:外部APIとの連携に失敗しました',
          messageColor: 'error',
          isDisplay: true
        });
      }
    }
  ).catch((err) => {
    console.error(`API Error2. ${JSON.stringify(err)},${err}`);
    setMessageStater({
      message: 'エラー:外部APIとの連携に失敗しました',
      messageColor: 'error',
      isDisplay: true
    });
  });
  setEditQueryOfSaying({
    id: -1,
    saying: ''
  });
};
