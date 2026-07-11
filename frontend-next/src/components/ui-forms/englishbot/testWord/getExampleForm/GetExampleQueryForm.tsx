import React, { useState } from 'react';
import { FormGroup } from '@mui/material';
import { Card } from '@/components/ui-elements/card/Card';
import { Button } from '@/components/ui-elements/button/Button';
import { PullDown } from '@/components/ui-elements/pullDown/PullDown';
import { useSetRecoilState } from 'recoil';
import { messageState } from '@/atoms/Message';
import { GetExampleTestDataAPIResponseDto, PullDownOptionDto } from 'quizzer-lib';
import { getExampleTestDataAPI } from '@/utils/api-wrapper';

interface GetExampleQueryFormProps {
  sourcelistoption: PullDownOptionDto[];
  setDisplayTestData?: React.Dispatch<React.SetStateAction<GetExampleTestDataAPIResponseDto>>;
  setTotalCount?: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const GetExampleQueryForm = ({
  sourcelistoption,
  setDisplayTestData,
  setTotalCount
}: GetExampleQueryFormProps) => {
  const [sourceId, setSourceId] = useState<number | undefined>(undefined);
  const setMessage = useSetRecoilState(messageState);

  return (
    <>
      <Card attr={['through-card', 'padding-vertical']}>
        <FormGroup>
          <PullDown
            label={'出典'}
            optionList={sourcelistoption}
            onChange={(e) => {
              setSourceId(e.target.value !== '' ? +e.target.value : undefined);
            }}
          />
        </FormGroup>
      </Card>
      <Button
        label={'Random Example'}
        attr={'button-array'}
        variant="contained"
        color="primary"
        onClick={async () => {
          setMessage({ message: '通信中...', messageColor: '#d3d3d3', isDisplay: true });
          const result = await getExampleTestDataAPI({
            getExampleTestData: { sourceId }
          });
          setMessage(result.message);
          setTotalCount && setTotalCount(result.total);
          if (result.message.messageColor === 'common.black') {
            setDisplayTestData &&
              setDisplayTestData(result.result as GetExampleTestDataAPIResponseDto);
          }
        }}
      />
    </>
  );
};
