import React from 'react';
import EnglishBotHeader from './EnglishBotHeader';
import EnglishBotFooter from './EnglishBotFooter';
import EnglishBotSideBar from './EnglishBotSideBar';
import { adjustedSpaceStyle } from '../../../styles/Layout';
import { RecoilRoot } from 'recoil';

export default function EnglishBotLayout(props: any) {
  return (
    <>
      <RecoilRoot>
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
      </RecoilRoot>
    </>
  );
}
