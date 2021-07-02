import React from 'react';
import styled from 'styled-components';
import ImgReward from 'src/assets/img/reward.svg';
import { NavLink } from 'react-router-dom';
import useMyTicket from 'src/hooks/useMyTicket';
import NumberDisplay from 'src/components/Number';
import useMyRoundTicket from 'src/views/TicketDetail/hooks/useMyRoundTicket';

const LastTicketsBox: React.FC<{ lotteryId: number }> = ({ lotteryId }) => {
  const myTickets = useMyTicket(lotteryId);
  const { totalClaimable, winCount } = useMyRoundTicket(lotteryId);

  return (
    <StyledWrapper>
      <img className="icon-reward" src={ImgReward} />
      <StyledTicketCount>
        You have {winCount ? winCount : 0} / {myTickets?.length} winning tickets in this round
      </StyledTicketCount>
      <StyledTotalTicketPrize>
        <div className={'prize-title'}>Total Prize:</div>
        <div className="prize-value">
          <NumberDisplay value={totalClaimable} decimals={18} precision={0} keepZeros={true} />
          <span className="prize-unit">IRON</span>
        </div>
      </StyledTotalTicketPrize>
      <StyledNavLink active="true" to={`/ticket?lotteryId=${lotteryId}`}>
        Check results
      </StyledNavLink>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12px;
  padding-top: 30px;
  @media (max-width: 768px) {
    width: 100%;
    padding-top: 20px;
  }
`;

const StyledTicketCount = styled.div`
  color: #753f41;
  font-weight: bold;
  margin-top: 23px;
  @media (max-width: 768px) {
    text-align: center;
    margin-top: 10px;
  }
`;

const StyledTotalTicketPrize = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  .prize-title {
    font-size: 20px;
    color: #400003;
    font-weight: bold;
  }
  .prize-value {
    font-size: 2rem;
    line-height: 1.3;
    text-transform: uppercase;
    font-weight: 700;
    color: ${({ theme }) => theme.color.green[600]};
    margin-left: 8px;
  }
  .prize-unit {
    font-size: 1.5rem;
    margin-left: 5px;
    font-weight: 800;
  }
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const StyledNavLink = styled(NavLink)<{ active?: string }>`
  font-size: 16px;
  appearance: none;
  background-color: ${({ active, theme }) =>
    active ? theme.color.orange[500] : 'transparent'};
  font-family: ${(p) => p.theme.font.heading};
  color: #460000;
  border: solid 3px #4d0000;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  cursor: pointer;
  transition: ease-in-out 100ms;
  text-decoration: none;
  &:hover {
    background-color: ${(p) => p.theme.color.bg};
  }
  margin-top: 25px;
  @media (max-width: 768px) {
    margin-top: 15px;
  }
`;

export default LastTicketsBox;
