import React from 'react';

import { List, ListItem } from '@mui/material';
import Head from 'next/head';
import { Header } from '@/components/ui-parts/header/Header';
import { SideBar, toggleDrawer } from '@/components/ui-parts/sideBar/SideBar';
import { Footer } from '@/components/ui-parts/footer/Footer';
import { useRecoilState } from 'recoil';
import { isOpenState } from '@/atoms/SideBar';
import { Button } from '@/components/ui-elements/button/Button';
import { MessageBar } from '@/components/ui-elements/messageBar/MessageBar';
import { messageState } from '@/atoms/Message';
import RequiredAuthComponent from '@/components/ui-elements/requiredAuthComponent/RequiredAuthComponent';
import type { SideBarModeType } from '@/constants/contents/sidebar';
import { sidebar } from '@/constants/contents/sidebar';
import { PAGE_TITLE } from '@/constants/contents/page';

interface LayoutProps {
  title?: string;
  contents: JSX.Element;
  mode: SideBarModeType;
  isProtected?: boolean;
}

export const Layout = ({ title, contents, mode, isProtected = true }: LayoutProps) => {
  const [sidebarState, setSidebarState] = useRecoilState(isOpenState);
  const [message, setMessage] = useRecoilState(messageState);
  const modeConfig = sidebar[mode];
  const layout = (
    <>
      {/*Head タイトルなど*/}
      <Head>
        <title>{PAGE_TITLE[mode] + title}</title>
      </Head>
      {/*ヘッダ*/}
      <Header
        bgColor={modeConfig.bgColor}
        subTitle={title}
        onClick={modeConfig.contents.length > 0 ? toggleDrawer(true, setSidebarState) : undefined}
      ></Header>

      {/*サイドバー、sideBarContens無い場合非表示*/}
      {modeConfig.contents.length > 0 ? (
        <SideBar>
          <List>
            {modeConfig.contents.map((value) => (
              <ListItem key={value.name}>
                <Button
                  attr={'no-min-width'}
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
      <div className="h-[44px] md:h-[48px]"></div>

      {/*内容*/}
      {contents}
      <MessageBar
        messageState={message || { message: '', messageColor: 'common.black' }}
        setMessageState={setMessage}
      />

      {/*フッタとコンテンツ間の調整余白 */}
      <div className="h-[40px]"></div>

      {/*フッタ*/}
      <Footer bgColor={modeConfig.bgColor} topHref={process.env.NEXT_PUBLIC_URL_END || ''}></Footer>
    </>
  );
  return isProtected ? <RequiredAuthComponent>{layout}</RequiredAuthComponent> : layout;
};
