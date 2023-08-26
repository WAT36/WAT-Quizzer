import React from 'react';
import EnglishBotHeader from './EnglishBotHeader';
import EnglishBotFooter from './EnglishBotFooter';
import EnglishBotSideBar from './EnglishBotSideBar';
import { adjustedSpaceStyle } from '../../../styles/Layout';
import Head from 'next/head';

type Props = {
  contents: JSX.Element;
  title?: string;
};

export default function EnglishBotLayout(props: Props) {
  return (
    <>
      {/*Head タイトルなど*/}
      <Head>
        <title>{'WAT Quizzer(EnglishBot) ' + props.title}</title>
      </Head>
      {/*ヘッダ*/}
      <EnglishBotHeader />

      {/*サイドバー*/}
      <EnglishBotSideBar />

      {/*ヘッダとコンテンツ間の調整余白 */}
      <div style={adjustedSpaceStyle}></div>

      {/*内容*/}
      {props.contents}

      {/*フッタとコンテンツ間の調整余白 */}
      <div style={adjustedSpaceStyle}></div>

      {/*フッタ*/}
      <EnglishBotFooter />
    </>
  );
}
