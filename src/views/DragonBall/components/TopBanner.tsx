import React, { useMemo } from 'react';
import styled from 'styled-components';
import NextDrawCountdown from './NextDrawCountdown';
import ImgBannerLeft from 'src/assets/img/banner-left.webp';
import ImgBannerRight from 'src/assets/img/banner-right.svg';
import Banner from 'src/assets/img/banner_lottery.png';
import isPast from 'date-fns/isPast';

interface TopBannerProps {
  notReady: boolean;
  lotteryId: number;
  startingTimestamp: Date;
  closingTimestamp: Date;
}

const TopBanner: React.FC<TopBannerProps> = ({
  notReady,
  lotteryId,
  startingTimestamp,
  closingTimestamp,
}) => {
  const notStarted = useMemo(() => {
    if (!startingTimestamp) {
      return false;
    }
    return !isPast(startingTimestamp);
  }, [startingTimestamp]);

  const isPastClosing = useMemo(() => {
    return isPast(closingTimestamp);
  }, [closingTimestamp]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img style={{ width: '95%' }} src={Banner} />
      <TopCountdownBanner small={notReady} className={notReady ? 'small' : ''}>
        <TopCountdownContent className="content">
          {notReady ? (
            <h2>The next Sacrifice to the Gods is not ready</h2>
          ) : notStarted ? (
            <h2>Round {lotteryId?.toString()} has not yet started</h2>
          ) : (
            <>
              <h4>Next Sacrifice - Round {lotteryId?.toString()}</h4>
              {isPastClosing ? (
                <DrawingContainer>Awaiting for results...</DrawingContainer>
              ) : (
                <NextDrawCountdown to={closingTimestamp} />
              )}
            </>
          )}
        </TopCountdownContent>
      </TopCountdownBanner>
    </div>
  );
};

const TopCountdownBanner = styled.div<{ small?: boolean }>`
  margin-top: 20px;
  position: relative;
  background-color: #a3212a;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  text-transform: uppercase;
  font-size: 16px;
  height: ${({ small }) => (small ? '80px' : '100px')};
  @media (max-width: 768px) {
    height: 85px;
  }
`;
const TopCountdownContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  h4 {
    margin: 0;
    font-weight: 500;
  }
  h2 {
    margin: 0;
    font-size: 22px;
  }
  @media (max-width: 768px) {
    padding-left: 40px;
    padding-right: 10px;
    text-align: center;
    h4 {
      font-size: 14px;
    }
  }
`;
const TopCountdownLeft = styled.div`
  position: absolute;
  left: 15px;
  bottom: -6px;
  img {
    width: 180px;
  }
  @media (max-width: 768px) {
    left: 5px;
    bottom: 0px;
    img {
      width: 60px;
    }
  }
`;
const TopCountdownRight = styled.div`
  position: absolute;
  right: 25px;
  @media (max-width: 768px) {
    img {
      display: none;
    }
  }
`;

const DrawingContainer = styled.h2`
  color: ${(props) => props.theme.color.green[600]} !important;
  font-weight: 700;
`;

export default TopBanner;
