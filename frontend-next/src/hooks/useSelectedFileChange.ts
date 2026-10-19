import type { SelectChangeEvent } from '@mui/material';
import { getCategoryListOptions } from '@/utils/getCategoryListOptions';
import type { GetQuizAPIRequestDto, Message, PullDownOptionDto, SearchQuizAPIRequestDto } from 'quizzer-lib';
import type { SetterOrUpdater } from 'recoil';

type Props = {
  setMessage: SetterOrUpdater<Message>;
  setCategorylistoption: React.Dispatch<React.SetStateAction<PullDownOptionDto[]>>;
  setQuizRequestData?: React.Dispatch<React.SetStateAction<GetQuizAPIRequestDto>>;
  setSearchQuizRequestData?: React.Dispatch<React.SetStateAction<SearchQuizAPIRequestDto>>;
};

export const useSelectedFileChange = ({
  setMessage,
  setCategorylistoption,
  setQuizRequestData,
  setSearchQuizRequestData
}: Props) => {
  return (e: SelectChangeEvent<number | string>) => {
    setMessage({
      message: '通信中...',
      messageColor: '#d3d3d3',
      isDisplay: true
    });
    setQuizRequestData &&
      setQuizRequestData((prev) => ({
        ...prev,
        file_num: +e.target.value
      }));
    setSearchQuizRequestData &&
      setSearchQuizRequestData((prev) => ({
        ...prev,
        file_num: +e.target.value
      }));

    void (async () => {
      const { pullDownOption, message } = await getCategoryListOptions(String(e.target.value));
      setMessage(message);
      setCategorylistoption(pullDownOption);
    })();
  };
};
