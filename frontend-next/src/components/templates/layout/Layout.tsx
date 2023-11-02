import React from 'react';

import styles from './Layout.module.css';
import { List, ListItem } from '@mui/material';
import Head from 'next/head';
import { Header } from '@/components/ui-parts/header/Header';
import { SideBar, toggleDrawer } from '@/components/ui-parts/sideBar/SideBar';
import { Footer } from '@/components/ui-parts/footer/Footer';
import { useRecoilState } from 'recoil';
import { isOpenState } from '@/atoms/SideBar';
import { Button } from '@/components/ui-elements/button/Button';
import { MessageState } from '../../../../interfaces/state';
import { MessageBar } from '@/components/ui-elements/messageBar/MessageBar';

interface LayoutConfig {
  bgColor: string;
  sideBarContents: {
    name: string;
    link: string;
  }[];
}

interface LayoutProps {
  title?: string;
  contents: JSX.Element;
  mode: 'quizzer' | 'englishBot' | 'settings';
  messageState?: MessageState;
  setMessageStater?: React.Dispatch<React.SetStateAction<MessageState>>;
}

const urlEnd = process.env.NEXT_PUBLIC_URL_END || '';
const config: { [key: string]: LayoutConfig } = {
  quizzer: {
    bgColor: '#0077B6',
    sideBarContents: [
      { name: 'トップ', link: urlEnd },
      { name: '問題出題', link: '/quizzer' + urlEnd },
      { name: '問題追加', link: '/quizzer/addQuiz' + urlEnd },
      { name: '問題編集', link: '/quizzer/editQuiz' + urlEnd },
      { name: '問題検索', link: '/quizzer/searchQuiz' + urlEnd },
      { name: '問題削除', link: '/quizzer/deleteQuiz' + urlEnd },
      { name: 'カテゴリ別正解率表示', link: '/quizzer/accuracyRateGraph' + urlEnd },
      { name: '画像アップロード', link: '/quizzer/imageUpload' + urlEnd },
      { name: '設定', link: '/quizzer/settings' + urlEnd }
    ]
  },
  englishBot: {
    bgColor: 'midnightblue',
    sideBarContents: [
      { name: 'Top', link: '/englishBot' + urlEnd },
      { name: 'Add Words', link: '/englishBot/addWord' + urlEnd },
      { name: 'Dictionary', link: '/englishBot/dictionary' + urlEnd },
      { name: 'Detail Word', link: '/englishBot/detailWord' + urlEnd },
      { name: 'Add Example', link: '/englishBot/addExample' + urlEnd },
      { name: 'Test Words', link: '/englishBot/testWord' + urlEnd }
    ]
  },
  settings: {
    bgColor: '#0288d1',
    sideBarContents: []
  }
};

export const Layout = ({ title, contents, mode = 'quizzer', messageState, setMessageStater }: LayoutProps) => {
  const [sidebarState, setSidebarState] = useRecoilState(isOpenState);
  const modeConfig = config[mode];
  return (
    <>
      {/*Head タイトルなど*/}
      <Head>
        <title>{'WAT Quizzer ' + title}</title>
      </Head>
      {/*ヘッダ*/}
      <Header
        bgColor={modeConfig.bgColor}
        onClick={modeConfig.sideBarContents.length > 0 ? toggleDrawer(true, setSidebarState) : undefined}
      ></Header>

      {/*サイドバー、sideBarContens無い場合非表示*/}
      {modeConfig.sideBarContents.length > 0 ? (
        <SideBar>
          <List>
            {modeConfig.sideBarContents.map((value) => (
              <ListItem key={value.name}>
                <Button
                  variant="text"
                  href={value.link}
                  label={value.name}
                  onClick={toggleDrawer(false, setSidebarState)}
                />
              </ListItem>
            ))}
          </List>
        </SideBar>
      ) : (
        <></>
      )}

      {/*ヘッダとコンテンツ間の調整余白 */}
      <div className={styles.space}></div>

      {/*内容*/}
      {contents}
      <MessageBar
        messageState={messageState || { message: '', messageColor: 'common.black' }}
        setMessageState={setMessageStater}
      />

      {/*フッタとコンテンツ間の調整余白 */}
      <div className={styles.space}></div>

      {/*フッタ*/}
      <Footer bgColor={modeConfig.bgColor} topHref={process.env.NEXT_PUBLIC_URL_END || ''}></Footer>
    </>
  );
};
