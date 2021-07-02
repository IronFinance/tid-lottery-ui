import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, BoxHeader } from 'src/components/Box';
import Container from 'src/components/Container';
import Page from 'src/components/Page';
import styled from 'styled-components';
import imageTicket from '../../assets/img/image-ticket.svg';
import imageWin from '../../assets/img/image-win.svg';
import imageClock from '../../assets/img/img-clock.svg';
import bgRound from '../../assets/img/bg_confirm.png';
import NumberDisplay from 'src/components/Number';
import NextDrawCountdown from '../DragonBall/components/NextDrawCountdown';
import useDiamondHand from 'src/hooks/useDiamondHand';
import TicketClaim from './components/TicketClaim';
import useRoundInfo from './hooks/useRoundInfo';
import { useHistory } from 'react-router-dom';
import useQuery from 'src/hooks/useQuery';
import { BigNumber } from 'ethers';

enum Status {
  NotStarted,
  Open,
  Closed,
  Completed,
}

const TicketDetail: React.FC = () => {
  const dh = useDiamondHand();
  const history = useHistory();
  const query = useQuery();
  const [currentRound, setCurentRound] = useState<number | undefined>(undefined);
  const [roundId, setRoundId] = useState<number | undefined>(undefined);
  const [currentPrize, setCurrentPrize] = useState<BigNumber[]>([]);
  const lotteryInfo = useRoundInfo(roundId);

  useEffect(() => {
    const lotteryId = query?.get('lotteryId');
    setRoundId(parseInt(lotteryId) || 0);
  }, [query]);

  useEffect(() => {
    if (!dh) return;
    dh?.LOTTERY?.getCurrentLotto().then((data) => {
      setCurentRound(data.lotteryID.toNumber());
    });
    dh?.LOTTERY?.getCurrentPrizes().then((prizes) => {
      setCurrentPrize(prizes);
    });
  }, [dh, history, roundId]);

  const closing = useMemo(() => {
    if (!lotteryInfo) {
      return;
    }
    return lotteryInfo.closingTimestamp.toNumber() * 1000;
  }, [lotteryInfo]);

  const isPastClosing = useMemo(() => {
    const now = Date.now();
    if (closing) {
      return now - closing > 0;
    }
  }, [closing]);

  const tickets = useMemo(() => {
    const temp: number[] = [];
    if (!currentRound) {
      return temp;
    }
    for (let i = 1; i <= currentRound; i++) {
      temp.push(i);
    }
    return temp;
  }, [currentRound]);

  const isClose = useMemo(() => {
    if (!lotteryInfo) {
      return false;
    }
    return lotteryInfo.lotteryStatus === Status.Completed;
  }, [lotteryInfo]);

  const onSelect = useCallback(
    (event) => {
      history.push(`?lotteryId=${event.target.value}`);
    },
    [history],
  );

  return (
    <Page>
      <Container size="lg">
        <StyledHeader>
          <img src={imageTicket} />
          TICKETS
          <StyledSelect value={roundId} onChange={onSelect}>
            {tickets.map((item, index) => (
              <option key={index} value={item}>
                Round {item}
              </option>
            ))}
          </StyledSelect>
        </StyledHeader>
        <StyledContent>
          <Box>
            <BoxHeader bg="#ffe970">
              <BoxTitle>Round {roundId}</BoxTitle>
              <StyledNumberTicket>
                Total sold:&nbsp;
                <NumberDisplay
                  value={lotteryInfo?.numberOfTickets}
                  decimals={0}
                  precision={0}
                  keepZeros={true}
                />
                &nbsp;tickets
              </StyledNumberTicket>
            </BoxHeader>
            <BoxBody>
              <StyledBoxContent>
                <StyledRound>
                  <img src={isClose ? imageWin : imageClock} />
                  {isClose ? 'Winning Numbers' : 'Winning numbers will be drawn in'}
                </StyledRound>
                {isClose ? (
                  <StyledWinNumber>
                    {lotteryInfo?.winningNumbers?.map((item, index) => (
                      <StyledWinNumberItem key={index}>{item || 0}</StyledWinNumberItem>
                    ))}
                  </StyledWinNumber>
                ) : (
                  <StyledCountdown>
                    {isPastClosing ? (
                      <div>Awaiting for results...</div>
                    ) : (
                      <NextDrawCountdown to={closing ? new Date(closing) : undefined} />
                    )}
                  </StyledCountdown>
                )}
                <StyledTable compact={!isClose}>
                  <thead>
                    <tr>
                      <th>Prize</th>
                      <th>Prize Pot</th>
                      {isClose && <th>Winners</th>}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>JackPot</td>
                      <td>
                        <NumberDisplay
                          value={
                            roundId === currentRound && !isClose
                              ? currentPrize[0]
                              : lotteryInfo?.prizes[0]
                          }
                          decimals={18}
                          precision={0}
                          keepZeros={true}
                        />
                        <span>&nbsp;IRON</span>
                      </td>
                      {isClose && <td>{lotteryInfo?.winners[0]?.toString() ?? 0}</td>}
                    </tr>
                    <tr>
                      <td>Match 4</td>
                      <td>
                        <NumberDisplay
                          value={
                            roundId === currentRound && !isClose
                              ? currentPrize[1]
                              : lotteryInfo?.prizes[1]
                          }
                          decimals={18}
                          precision={0}
                          keepZeros={true}
                        />
                        <span>&nbsp;IRON</span>
                      </td>
                      {isClose && <td>{lotteryInfo?.winners[1]?.toString() ?? 0}</td>}
                    </tr>
                    <tr>
                      <td>Match 3</td>
                      <td>
                        <NumberDisplay
                          value={
                            roundId === currentRound && !isClose
                              ? currentPrize[2]
                              : lotteryInfo?.prizes[2]
                          }
                          decimals={18}
                          precision={0}
                          keepZeros={true}
                        />
                        <span>&nbsp;IRON</span>
                      </td>
                      {isClose && <td>{lotteryInfo?.winners[2]?.toString() ?? 0}</td>}
                    </tr>
                  </tbody>
                </StyledTable>
                {lotteryInfo && <TicketClaim roundId={roundId} isCloseRound={isClose} />}
              </StyledBoxContent>
            </BoxBody>
          </Box>
        </StyledContent>
      </Container>
    </Page>
  );
};

export default TicketDetail;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  color: #4d0000;
  font-family: ${({ theme }) => theme.font.heading};
  border-bottom: 2px dashed #4d0000;
  padding: 20px 0px 16px 0px;
  img {
    width: 68px;
    margin-right: 12px;
  }
`;

const StyledSelect = styled.select`
  margin-left: auto;
  padding: 5px 6px;
  border: solid 2px #400003;
  background-color: #cbf8ff;
  font-size: 16px;
  font-weight: 600;
  color: #400003;
`;

const StyledContent = styled.div`
  margin: 27px 60px 0px 60px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: 27px 0px 0px 0px;
  }
`;

const BoxTitle = styled.div`
  font-family: ${({ theme }) => theme.font.heading};
  font-size: 32px;
  font-weight: normal;
`;

const StyledNumberTicket = styled.div`
  margin-left: auto;
  font-size: 16px;
  font-weight: 600;
  color: #400003;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0px;
  }
`;

const BoxBody = styled.div``;

const StyledBoxContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 27px;
`;

const StyledRound = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #400003;
  text-align: center;
  background-image: url(${bgRound});
  background-repeat: no-repeat;
  background-size: contain;
  img {
    width: 140px;
    margin-bottom: 18px;
  }
`;

const StyledCountdown = styled.div`
  font-size: 28px;
  font-weight: normal;
  color: #f69963;
  margin-top: 20px;
  font-family: ${({ theme }) => theme.font.heading};
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 20px;
  }
`;

const StyledWinNumber = styled.div`
  padding: 20px 58px;
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 20px 18px;
  }
`;

const StyledWinNumberItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 86px;
  height: 86px;
  font-size: 48px;
  font-weight: bold;
  background: #ffe970;
  border: solid 3px #400003;
  margin: 0px 40px;
  :last-child {
    background: #ff8173;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 50px;
    height: 50px;
    font-size: 30px;
    margin: 0px 10px;
  }
`;

const StyledTable = styled.table<{ compact?: boolean }>`
  width: ${({ compact }) => (compact ? '80%' : '100%')};
  padding: 24px 58px;
  border-spacing: 0px;
  border: none;
  thead {
    th {
      width: 33%;
      padding: 6px 0px 0px 20px;
      background-color: #e7faff;
      font-size: 16px;
      font-weight: 500;
      color: #753f41;
      :last-child {
        width: 10%;
      }
    }
  }
  tbody {
    td {
      padding: 8px 0px 0px 20px;
      font-size: 16px;
      font-weight: 600;
      span {
        font-weight: normal;
      }
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 24px 18px;
  }
`;
