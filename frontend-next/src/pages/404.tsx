import { Title } from '@/components/ui-elements/title/Title';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect, useState } from 'react';

// englishbot dynamic routing用
const redirectPath = /^\/englishBot\/detailWord\/.+/g;

export default function Custom404() {
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    // Your condition that can validate the URL
    const pathName = window.location.pathname;

    if (pathName.match(redirectPath)) {
      Router.replace(pathName); // Redirect to the right page...
    } else {
      setIsNotFound(true);
    }
  }, []);

  if (isNotFound) {
    return (
      <>
        <Head>
          <Title label="404 Not Found"></Title>
          <p>お探しのページは存在しません。</p>
        </Head>
      </>
    );
  }

  return null;
}
