import React from 'react';
import EnglishBotFooter from './EnglishBotFooter';
import EnglishBotSideBar from './EnglishBotSideBar';
import { adjustedSpaceStyle } from '../../../styles/Layout';
import Head from 'next/head';
import { toggleDrawer } from '../../../../utils/englishBot/SideBar';
import { Header } from '@/components/ui-parts/header/Header';
import { useSetRecoilState } from 'recoil';
import { isOpenState } from '@/atoms/SideBar';

type Props = {
  contents: JSX.Element;
  title?: string;
};

export default function EnglishBotLayout(props: Props) {
  const setSidebarState = useSetRecoilState(isOpenState);
  return (
    <>
      {/*Head タイトルなど*/}
      <Head>
        <title>{'WAT Quizzer(EnglishBot) ' + props.title}</title>
      </Head>
      {/*ヘッダ*/}
      {/* <EnglishBotHeader /> */}
      <Header bgColor="midnightblue" onClick={toggleDrawer(true, setSidebarState)}></Header>

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
