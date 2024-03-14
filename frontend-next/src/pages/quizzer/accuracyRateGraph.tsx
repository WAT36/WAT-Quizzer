import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { GetAccuracyRateByCategoryServiceDto } from '../../../interfaces/api/response';
import { Layout } from '@/components/templates/layout/Layout';
import { getFileList } from '@/common/response';
import { MessageState, PullDownOptionState, QueryOfGetAccuracyState } from '../../../interfaces/state';
import { Title } from '@/components/ui-elements/title/Title';
import { GetFileForm } from '@/components/ui-forms/quizzer/accuracyRateGraph/getFileForm/GetFileForm';
import { GetFileButtonGroup } from '@/components/ui-forms/quizzer/accuracyRateGraph/getFileButtonGroup/GetFileButtonGroup';
import { AccuracyChart } from '@/components/ui-forms/quizzer/accuracyRateGraph/accuracyChart/AccuracyChart';

type Props = {
  isMock?: boolean;
};

export default function AccuracyRateGraphPage({ isMock }: Props) {
  const [queryOfGetAccuracy, setQueryOfGetAccuracy] = useState<QueryOfGetAccuracyState>({
    fileNum: -1
  });
  const [message, setMessage] = useState<MessageState>({
    message: '　',
    messageColor: 'common.black',
    isDisplay: false
  });
  const [accuracy_data, setAccuracyData] = useState<GetAccuracyRateByCategoryServiceDto>({
    result: [],
    checked_result: []
  });
  const [filelistoption, setFilelistoption] = useState<PullDownOptionState[]>([]);

  useEffect(() => {
    !isMock && getFileList(setMessage, setFilelistoption);
  }, []);

  const contents = () => {
    return (
      <Container>
        <Title label="WAT Quizzer"></Title>
        <GetFileForm
          filelistoption={filelistoption}
          queryOfGetAccuracy={queryOfGetAccuracy}
          setQueryOfGetAccuracy={setQueryOfGetAccuracy}
        />

        <GetFileButtonGroup
          queryOfGetAccuracy={queryOfGetAccuracy}
          setMessage={setMessage}
          setAccuracyData={setAccuracyData}
        />

        <AccuracyChart accuracyData={accuracy_data} />
      </Container>
    );
  };

  return (
    <>
      <Layout
        mode="quizzer"
        contents={contents()}
        title={'カテゴリ別正解率表示'}
        messageState={message}
        setMessageStater={setMessage}
      />
    </>
  );
}
