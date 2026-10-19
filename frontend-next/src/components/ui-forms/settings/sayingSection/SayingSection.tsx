import type { PullDownOptionDto } from 'quizzer-lib';
import { AddSayingForm } from '../addSayingForm/AddSayingForm';
import { SearchSayingForm } from '../searchSayingForm/SearchSayingForm';
import { EditSayingForm } from '../editSayingForm/EditSayingForm';
import { Card } from '@/components/ui-elements/card/Card';

interface SayingSectionProps {
  booklistoption: PullDownOptionDto[];
}

export const SayingSection = ({ booklistoption }: SayingSectionProps) => {
  return (
    <>
      <Card variant="outlined" subHeader="格言" attr={['margin-vertical', 'padding']}>
        <AddSayingForm booklistoption={booklistoption} />
        <SearchSayingForm />
        <EditSayingForm />
      </Card>
    </>
  );
};
