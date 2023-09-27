import React from 'react';
import { adjustedSpaceStyle } from '../../../styles/Layout';
import Head from 'next/head';
import { Header } from '@/components/ui-parts/header/Header';
import { useRecoilState } from 'recoil';
import { isOpenState } from '@/atoms/SideBar';
import { Footer } from '@/components/ui-parts/footer/Footer';
import { SideBar, toggleDrawer } from '@/components/ui-parts/sideBar/SideBar';
import { List, ListItem } from '@mui/material';
import { Button } from '@/components/ui-elements/button/Button';

type Props = {
  contents: JSX.Element;
  title?: string;
};

// サイドバーのコンテンツ
const urlEnd = process.env.NEXT_PUBLIC_URL_END || '';
export const sideBarContents = [
  { name: 'トップ', link: urlEnd },
  { name: '問題出題', link: '/quizzer' + urlEnd },
  { name: '問題追加', link: '/quizzer/addQuiz' + urlEnd },
  { name: '問題編集', link: '/quizzer/editQuiz' + urlEnd },
  { name: '問題検索', link: '/quizzer/searchQuiz' + urlEnd },
  { name: '問題削除', link: '/quizzer/deleteQuiz' + urlEnd },
  { name: 'カテゴリ別正解率表示', link: '/quizzer/accuracyRateGraph' + urlEnd },
  { name: '画像アップロード', link: '/quizzer/imageUpload' + urlEnd },
  { name: '設定', link: '/quizzer/settings' + urlEnd }
];

export default function QuizzerLayout(props: Props) {
  const [sidebarState, setSidebarState] = useRecoilState(isOpenState);
  return (
    <>
      {/*Head タイトルなど*/}
      <Head>
        <title>{'WAT Quizzer ' + props.title}</title>
      </Head>
      {/*ヘッダ*/}
      <Header bgColor="#0077B6" onClick={toggleDrawer(true, setSidebarState)}></Header>

      {/*サイドバー*/}
      <SideBar>
        <List>
          {sideBarContents.map((value) => (
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
