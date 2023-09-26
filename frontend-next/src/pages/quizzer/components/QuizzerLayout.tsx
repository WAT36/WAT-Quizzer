import React from 'react';
import QuizzerSideBar from './QuizzerSideBar';
import { adjustedSpaceStyle } from '../../../styles/Layout';
import Head from 'next/head';
import { Header } from '@/components/ui-parts/header/Header';
import { useSetRecoilState } from 'recoil';
import { isOpenState } from '@/atoms/SideBar';
import { toggleDrawer } from '../../../../utils/quizzer/SideBar';
import { Footer } from '@/components/ui-parts/footer/Footer';

type Props = {
  contents: JSX.Element;
  title?: string;
};

export default function QuizzerLayout(props: Props) {
  const setSidebarState = useSetRecoilState(isOpenState);
  return (
    <>
      {/*Head タイトルなど*/}
      <Head>
        <title>{'WAT Quizzer ' + props.title}</title>
      </Head>
      {/*ヘッダ*/}
      <Header bgColor="#0077B6" onClick={toggleDrawer(true, setSidebarState)}></Header>

      {/*サイドバー*/}
      <QuizzerSideBar />

      {/*ヘッダとコンテンツ間の調整余白 */}
      <div style={adjustedSpaceStyle}></div>

      {/*内容*/}
      {props.contents}

      {/*フッタとコンテンツ間の調整余白 */}
      <div style={adjustedSpaceStyle}></div>

      {/*フッタ*/}
      <Footer bgColor="#0077B6" topHref={process.env.NEXT_PUBLIC_URL_END || ''}></Footer>
    </>
  );
}
