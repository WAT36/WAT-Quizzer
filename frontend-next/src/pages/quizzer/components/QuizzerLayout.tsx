import React from 'react';
import QuizzerHeader from './QuizzerHeader';
import QuizzerFooter from './QuizzerFooter';
import QuizzerSideBar from './QuizzerSideBar';
import { adjustedSpaceStyle } from '../../../styles/Layout';
import Head from 'next/head';

type Props = {
  contents: JSX.Element;
  title?: string;
};

export default function QuizzerLayout(props: Props) {
  return (
    <>
      {/*Head タイトルなど*/}
      <Head>
        <title>{'WAT Quizzer ' + props.title}</title>
      </Head>
      {/*ヘッダ*/}
      <QuizzerHeader />

      {/*サイドバー*/}
      <QuizzerSideBar />

      {/*ヘッダとコンテンツ間の調整余白 */}
      <div style={adjustedSpaceStyle}></div>

      {/*内容*/}
      {props.contents}

      {/*フッタとコンテンツ間の調整余白 */}
      <div style={adjustedSpaceStyle}></div>

      {/*フッタ*/}
      <QuizzerFooter />
    </>
  );
}
