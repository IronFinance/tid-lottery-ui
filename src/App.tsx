import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Popups from './components/Popups';
import Updaters from './state/Updaters';
import theme from './theme';
import store from './state';
import { Provider } from 'react-redux';
import ModalsProvider from './contexts/Modals';
import IronBankProvider from './contexts/DiamondHandProvider';
import { ConfigProvider } from './contexts/ConfigProvider/ConfigProvider';
import { DynamicWalletProvider } from './contexts/DynamicWalletProvider/DynamicWalletProvider';

import Header from './components/Header';
import LoadingModal from './components/Loading/LoadingModal';
import { GlobalStyle } from './GlobalStyle';
import MainWrapper from './MainWrapper';
import { withPreload } from './hooks/usePreload';
import DragonBall from './views/DragonBall';
import BuyLottery from './views/DragonBall/components/BuyLottery';
import TicketDetail from './views/TicketDetail';
import { AccountBalanceProvider } from './contexts/AccountBalanceProvider/AccountBalanceProvider';
import { CurrentLotteryInfoProvider } from './contexts/CurrentLotteryProvider/CurrentLotteryProvider';
import Monitor from './views/Monitor';

const App: React.FC = () => {
  return (
    <Providers>
      <StyledSite>
        <Router>
          <MainWrapper>
            <StyledHeaderContainer>
              <Header />
            </StyledHeaderContainer>
            <Switch>
              <Route path="/" exact>
                <DragonBall />
              </Route>
              <Route path="/buy" exact>
                <BuyLottery />
              </Route>
              <Route path="/ticket" exact>
                <TicketDetail />
              </Route>
              <Route path="/monitor">
                <Monitor />
              </Route>
              <Redirect to="/" />
            </Switch>
          </MainWrapper>
        </Router>
      </StyledSite>
    </Providers>
  );
};

const StyledSite = styled.div``;

const StyledHeaderContainer = styled.div`
  width: 100%;
  margin-bottom: 5px;
  padding: 10px 8px 0 8px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 20px 24px 0 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 10px 24px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 20px 16px 0 16px;
  }
`;

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ConfigProvider>
        <DynamicWalletProvider>
          <Provider store={store}>
            <Updaters />
            <IronBankProvider>
              <AccountBalanceProvider>
                <ModalsProvider>
                  <CurrentLotteryInfoProvider>
                    <>
                      <LoadingModal />
                      <Popups />
                      {children}
                    </>
                  </CurrentLotteryInfoProvider>
                </ModalsProvider>
              </AccountBalanceProvider>
            </IronBankProvider>
          </Provider>
        </DynamicWalletProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default withPreload(App, 10 ** 3);
