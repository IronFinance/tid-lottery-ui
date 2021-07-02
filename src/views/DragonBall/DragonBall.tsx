import React, { useMemo } from 'react';
import Container from 'src/components/Container';
import Page from 'src/components/Page';
import styled from 'styled-components';
import HowItWorks from './components/HowItWorks';
import { BigNumber } from '@ethersproject/bignumber';
import TopBanner from './components/TopBanner';
import RoundPrizeBox from './components/RoundPrizeBox';
import YourCurrentTicketsBox from './components/YourCurrentTicketsBox';
import LastRoundResults from './components/LastRoundResults';
import { useCurrentLotto } from 'src/contexts/CurrentLotteryProvider/CurrentLotteryProvider';
import { LotteryStatus } from 'src/diamondhand/Lottery';

const DragonBall: React.FC = () => {
  const { info, prizes: currentPrizes } = useCurrentLotto();

  const total = useMemo(() => {
    if (!currentPrizes || currentPrizes.length == 0) return BigNumber.from(0);
    let total = currentPrizes[0];
    total = total.add(currentPrizes[1]);
    total = total.add(currentPrizes[2]);
    return total;
  }, [currentPrizes]);

  const isCompleted = useMemo(() => {
    return info?.lotteryStatus === LotteryStatus.Completed;
  }, [info?.lotteryStatus]);

  const latestLotteryDrawnId = useMemo(() => {
    if (!info) {
      return;
    }
    if (isCompleted) {
      return info.lotteryId;
    }
    return info.lotteryId - 1;
  }, [info, isCompleted]);

  return (
    <Page>
      <Container size="lg">
        <TopBanner
          notReady={isCompleted}
          lotteryId={info?.lotteryId}
          startingTimestamp={info?.startingTimestamp}
          closingTimestamp={info?.closingTimestamp}
        />
        {info && !isCompleted && (
          <StyledDoubleCol>
            <StyledCol>
              <RoundPrizeBox
                total={total}
                prizes={currentPrizes}
                ticketsSold={info?.numberOfTickets}
              />
            </StyledCol>
            <StyledCol>
              <YourCurrentTicketsBox
                lotteryId={info?.lotteryId}
                startingTimestamp={info?.startingTimestamp}
                closingTimestamp={info?.closingTimestamp}
                costPerTicket={info?.costPerTicket}
              />
            </StyledCol>
          </StyledDoubleCol>
        )}
        {latestLotteryDrawnId ? (
          <>
            <Separator />
            <LastRoundResults lotteryId={latestLotteryDrawnId} />
          </>
        ) : null}
        <Separator />
        <HowItWorks costPerTicket={info?.costPerTicket} />
      </Container>
    </Page>
  );
};

const StyledDoubleCol = styled.div`
  margin-top: 40px;
  display: grid;
  grid-gap: 20px;
  justify-items: center;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
  @media (max-width: 768px) {
    display: block;
    margin-top: 12px;
  }
`;

const StyledCol = styled.div`
  width: 100%;
  height: 100%;
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const Separator = styled.div`
  height: 1px;
  border-top: dashed 3px ${(props) => props.theme.color.primary.main};
  margin: 30px 0;
`;

export default DragonBall;
