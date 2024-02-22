import { Title } from '@/components/ui-elements/title/Title';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <Title label="404 Not Found"></Title>
        <p>お探しのページは存在しません。</p>
      </Head>
    </>
  );
}
