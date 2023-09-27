import React from 'react';
import { adjustedSpaceStyle } from '../../../styles/Layout';
import Head from 'next/head';
import { Header } from '@/components/ui-parts/header/Header';
import { useSetRecoilState } from 'recoil';
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
export const sideBarContents = [
  { name: 'Top', link: '/englishBot' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'Add Words', link: '/englishBot/addWord' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'Dictionary', link: '/englishBot/dictionary' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'Detail Word', link: '/englishBot/detailWord' + process.env.NEXT_PUBLIC_URL_END },
  { name: 'Add Example', link: '/englishBot/addExample' + process.env.NEXT_PUBLIC_URL_END }
];

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
      {/* <EnglishBotSideBar /> */}
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
      <Footer bgColor="midnightblue" topHref={process.env.NEXT_PUBLIC_URL_END || ''}></Footer>
    </>
  );
}
