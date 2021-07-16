import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';
import { Box, BoxBody, BoxHeader, BoxTitle } from 'src/components/Box';
import NumberDisplay from 'src/components/Number';
import { ExternalLinks } from 'src/config';
import styled from 'styled-components';
interface HowItWorksProps {
  costPerTicket: BigNumber;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ costPerTicket }) => {
  return (
    <Box>
      <BoxHeader bg="#12161e">
        <BoxTitle>How It Works</BoxTitle>
      </BoxHeader>
      <BoxBody>
        <StyledWrapper>
          <StyledItem>
            <StyledOrder>1</StyledOrder>
            <StyledContent>
              One Offering is{' '}
              <NumberDisplay
                value={costPerTicket}
                decimals={18}
                precision={0}
                keepZeros={true}
              />{' '}
              TITAN.{' '}
              <a href={ExternalLinks.buyTitan} target="_blank">
                Buy
              </a>{' '}
              TITAN first.
            </StyledContent>
          </StyledItem>
          <StyledItem>
            <StyledOrder>2</StyledOrder>
            <StyledContent>
              Sacrifice as many TITAN as you want to receive the Offering numbers.
            </StyledContent>
          </StyledItem>
          <StyledItem>
            <StyledOrder>3</StyledOrder>
            <StyledContent>
              The Sacrifice will happen every day 2 PM UTC. You win if your offering number
              matches at least 3 numbers.{' '}
              <a href={ExternalLinks.rules} target="_blank">
                See rules and example
              </a>
              .
            </StyledContent>
          </StyledItem>
          <StyledItem>
            <StyledOrder lastOrder>4</StyledOrder>
            <StyledContent>
              <div>Reward allocation: </div>
              <ul>
                <li>Jackpot: 60% </li>
                <li>Match 4: 30% </li>
                <li>Match 3: 10% </li>
              </ul>
              In case of more winners in a category, the pot will be divided.
            </StyledContent>
          </StyledItem>
        </StyledWrapper>
      </BoxBody>
    </Box>
  );
};

const StyledWrapper = styled.div`
  padding: 12px 25px;
  @media (max-width: 768px) {
    padding: 12px 1px;
  }
`;

const StyledItem = styled.div`
  display: flex;
  align-items: start;
  :not(:last-child) {
    padding-bottom: 30px;
  }
  @media (max-width: 768px) {
    min-height: 70px;
    :not(:last-child) {
      padding-bottom: 20px;
    }
  }
`;

const StyledOrder = styled.div<{ lastOrder?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #a3212a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
  ${({ lastOrder }) =>
    !lastOrder &&
    `:after {
      content: '';
      height: 30px;
      width: 1px;
      border-right: 2px dashed #f2f2f2;
      top: 32px;
      position: absolute;
      @media (max-width: 768px) {
        height: 60px;
      }
    }`}
`;

const StyledContent = styled.div`
  margin-left: 15px;
  font-weight: 300;
  flex: 1;
  a {
    color: ${(p) => p.theme.color.orange[500]};
    font-weight: 600;
    &:hover {
      color: ${(p) => p.theme.color.orange[300]};
    }
  }
  @media (max-width: 768px) {
    margin-left: 8px;
  }
  ul {
    margin: 0;
  }
`;

export default HowItWorks;
