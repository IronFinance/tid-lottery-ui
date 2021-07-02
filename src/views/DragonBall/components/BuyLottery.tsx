import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/pro-solid-svg-icons';
import { faCoins } from '@fortawesome/pro-solid-svg-icons';
import styled from 'styled-components';
import { TicketItemProp } from 'src/api/models';
import Container from 'src/components/Container';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import useApprove, { ApprovalState } from 'src/hooks/useApprove';
import useDiamondHand from 'src/hooks/useDiamondHand';
import useTryConnect from 'src/hooks/useTryConnect';
import theme from 'src/theme';
import SelectTicketItem from './SelectTicketItem';
import TicketImg from 'src/assets/img/ticket-white.svg';
import Page from 'src/components/Page';
import { flatten } from 'src/utils/objects';
import useHandleTransactionReceipt from 'src/hooks/useHandleTransactionReceipt';
import NumberDisplay from 'src/components/Number';
import { ExternalLinks } from 'src/config';
import { useTokenBalance } from 'src/contexts/AccountBalanceProvider/AccountBalanceProvider';
import { useCurrentLotto } from 'src/contexts/CurrentLotteryProvider/CurrentLotteryProvider';
import { useHistory } from 'react-router';
import useModal from 'src/hooks/useModal';
import BuyMultiTicketModal from './BuyMultiTicketModal';
import crypto from 'crypto';
import ButtonSelectCollateral from 'src/components/ButtonSelectCollateral';
import ERC20 from 'src/diamondhand/ERC20';
import { useWeb3React } from '@web3-react/core';
import Spacer from 'src/components/Spacer';

enum ButtonStatus {
  notConnected = 1,
  insufficient = 2,
  requireApproval = 3,
  approvalPending = 4,
  paused = 15,
  ready = 20,
  notEnough = 21,
}

const EmptyTicket: TicketItemProp = {
  selectedNumbers: [],
  selectedPowerNumber: undefined,
};

const LIMIT_TICKET = 50;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ranHex = (length: number) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const rand = (n: number, max: number, maxPowerBall: number) => {
  const hex = ranHex(64);
  let array: number[] = [];

  for (let index = 0; index < max; index++) {
    array[index] = index + 1;
  }

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  array = array.slice(0, n);
  array.push((parseInt('0x' + hex.substr(n + 1, 8)) % maxPowerBall) + 1);

  return array;
};

const BuyTickets: React.FC = () => {
  const diamondHand = useDiamondHand();
  const config = useConfiguration();
  const history = useHistory();
  const { tryConnect } = useTryConnect();
  const { account } = useWeb3React();
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const { info, maxValidRange, powerBallRange } = useCurrentLotto();
  const [tickets, setTickets] = useState<TicketItemProp[]>([EmptyTicket]);
  const [token, setToken] = useState<ERC20 | undefined>();
  const balance = useTokenBalance(token);

  useEffect(() => {
    if (!diamondHand || token) return;
    setToken(diamondHand.IRON);
  }, [diamondHand, token]);

  const buyAddress = useMemo(() => {
    if (!config) {
      return;
    }
    return config?.addresses?.Lottery;
  }, [config]);

  const [approvalTokenState, approveToken] = useApprove(token, buyAddress);

  const validTickets = useMemo(() => {
    return tickets.filter((t) => t.selectedNumbers.length === 4 && t.selectedPowerNumber);
  }, [tickets]);

  const totalCost = useMemo(() => {
    if (!info?.costPerTicket || !token) {
      return BigNumber.from(0);
    }
    return info.costPerTicket
      .mul(validTickets?.length || 0)
      .mul(BigNumber.from(1e6))
      .div(10 ** (18 - (token?.decimals || 18)))
      .div(1e6);
  }, [info?.costPerTicket, token, validTickets?.length]);

  const status = useMemo(() => {
    if (!account) {
      return ButtonStatus.notConnected;
    }

    if (approvalTokenState == ApprovalState.PENDING) {
      return ButtonStatus.approvalPending;
    }

    if (approvalTokenState !== ApprovalState.APPROVED) {
      return ButtonStatus.requireApproval;
    }

    if (balance && balance.lt(totalCost)) {
      return ButtonStatus.notEnough;
    }

    return ButtonStatus.ready;
  }, [approvalTokenState, account, totalCost, balance]);

  const buttonText = useMemo(() => {
    switch (status) {
      case ButtonStatus.notConnected:
        return 'Connect';

      case ButtonStatus.approvalPending:
        return `Approving ${token?.symbol}...`;

      case ButtonStatus.requireApproval:
        return 'Approve';

      case ButtonStatus.notEnough:
        return `Not Enough ${token?.symbol}`;

      default:
        return 'Buy tickets';
    }
  }, [status, token]);

  const addNewTicket = useCallback(() => {
    setTickets((x) => {
      const newBall = { ...EmptyTicket };
      return [...x, newBall];
    });
  }, []);

  const onChangeTicket = useCallback((index: number, ticket: TicketItemProp) => {
    setTickets((state) => {
      return state.map((item, idx) => {
        if (idx !== index) {
          return item;
        }

        return {
          ...item,
          ...ticket,
        };
      });
    });
  }, []);

  const onGenerateTicket = useCallback(
    (numberTicket: number, isRandom?: boolean) => {
      if (!numberTicket) return;
      if (!isRandom) {
        const generateTickets: TicketItemProp[] = Array(numberTicket).fill({ ...EmptyTicket });
        setTickets((state) => [...state, ...generateTickets]);
      } else {
        const generateTickets: TicketItemProp[] = [];
        for (let i = 0; i < numberTicket; i++) {
          const randomData = rand(4, maxValidRange, powerBallRange);
          const generateTicket: TicketItemProp = {
            selectedNumbers: randomData.slice(0, 4),
            selectedPowerNumber: randomData[4],
          };
          generateTickets.push(generateTicket);
        }
        setTickets((state) => [...state, ...generateTickets]);
      }
    },
    [maxValidRange, powerBallRange],
  );

  const [onPresentBuyMultiTicket] = useModal(
    <BuyMultiTicketModal
      limit={LIMIT_TICKET - tickets.length}
      onGenerateTicket={onGenerateTicket}
    />,
  );

  const removeTicket = useCallback((id: number) => {
    setTickets((tickets) => tickets.slice(0, id).concat(tickets.slice(id + 1)));
  }, []);

  const onChangePaymentToken = useCallback(
    (token?: ERC20) => {
      if (token) {
        setToken(diamondHand?.getTokenByAddress(token?.address));
      }
    },
    [diamondHand],
  );

  const buy = useCallback(async () => {
    const validTickets = tickets.filter(
      (t) => t.selectedNumbers.length === 4 && t.selectedPowerNumber,
    ); // TODO: real check
    const numbers = flatten(
      validTickets.map((t) => [...t.selectedNumbers, t.selectedPowerNumber]),
    );

    if (!validTickets.length) {
      return;
    }

    const tx = await handleTransactionReceipt(
      diamondHand?.LOTTERY.batchBuyLottoTicket(info?.lotteryId, validTickets?.length, numbers),
      `Buy ${validTickets.length} Dragon Ball tickets`,
    );

    if (tx && tx.response) {
      await tx.response.wait();
      tx.hideModal();
      history.push(`/ticket?lotteryId=${info?.lotteryId}`);
    }
  }, [diamondHand?.LOTTERY, handleTransactionReceipt, history, info?.lotteryId, tickets]);

  const onClickBuy = useCallback(async () => {
    switch (status) {
      case ButtonStatus.notConnected:
        tryConnect();
        break;
      case ButtonStatus.requireApproval:
        await approveToken();
        break;
      case ButtonStatus.notEnough:
      case ButtonStatus.approvalPending:
        break;
      case ButtonStatus.ready:
        buy();
        break;
    }
  }, [status, tryConnect, approveToken, buy]);

  return (
    <Page home>
      <Container size="homepage">
        <HeaderStyled>
          <BuyTicketHeaderStyled>
            <BuyTicketImagetyled>
              <img src={TicketImg} />
            </BuyTicketImagetyled>
            <BuyTicketLabeltyled>BUY TICKETS</BuyTicketLabeltyled>
          </BuyTicketHeaderStyled>
          <StyledHeaderRight>
            <StyledRole>Buy up to {LIMIT_TICKET} tickets</StyledRole>
            <Spacer />
            <StyledBuyMultiTicket className="btn" onClick={onPresentBuyMultiTicket}>
              Add multiple
            </StyledBuyMultiTicket>
          </StyledHeaderRight>
        </HeaderStyled>
        <StyledWrapBody>
          <StyledBody>
            <NumberTicketHeaderStyled>
              <StyledLabel>Tickets</StyledLabel>
            </NumberTicketHeaderStyled>
            <TicketContainerStyled>
              {tickets.map((ticket, index) => {
                return (
                  <SelectTicketItemContainerStyled key={index}>
                    <SelectTicketItem
                      index={index}
                      max={maxValidRange}
                      powerBallMax={powerBallRange}
                      ticketItem={ticket}
                      onChange={onChangeTicket}
                      removeTicket={removeTicket}
                    ></SelectTicketItem>
                  </SelectTicketItemContainerStyled>
                );
              })}
              <AddNewTicketButtonStyled
                disabled={tickets?.length >= LIMIT_TICKET}
                onClick={addNewTicket}
              >
                <AddNewTicketButtonHeader>Add new ticket</AddNewTicketButtonHeader>
                <AddNewTicketButtonPlus>+</AddNewTicketButtonPlus>
              </AddNewTicketButtonStyled>
            </TicketContainerStyled>
          </StyledBody>
          <StyledWrapPayment>
            <StyledPaymentLabel>Payment</StyledPaymentLabel>
            <StyledPaymentContent>
              <StyledPaymentHeader>
                <ButtonSelectCollateral
                  tokenAddress={token?.address}
                  onSelected={onChangePaymentToken}
                />
                <StyledBalance>
                  <span>Balance: </span>
                  <BignumberStyled>
                    <NumberDisplay
                      value={balance}
                      decimals={token?.decimals || 18}
                      precision={0}
                    />
                  </BignumberStyled>
                  <span className="unit">{token?.symbol}</span>
                </StyledBalance>
              </StyledPaymentHeader>
              <StyledPaymentBody>
                <StyledFlex>
                  <label>Price per ticket</label>
                  <BignumberStyled>
                    <NumberDisplay
                      value={info?.costPerTicket}
                      decimals={18}
                      precision={0}
                      keepZeros={true}
                    />
                    <span> {token?.symbol}</span>
                  </BignumberStyled>
                </StyledFlex>
                <StyledFlex>
                  <label>Number of tickets</label>
                  <BignumberStyled>{validTickets?.length}</BignumberStyled>
                </StyledFlex>
                <StyledFlex className="total">
                  <label>TOTAL</label>
                  <AmountStyled>
                    <NumberDisplay
                      value={totalCost}
                      decimals={token?.decimals || 18}
                      precision={4}
                      keepZeros={true}
                    />{' '}
                    {token?.symbol}
                  </AmountStyled>
                </StyledFlex>
                <ApproveButtonStyled
                  type="button"
                  className={
                    status == ButtonStatus.notEnough
                      ? 'btn btn-success not-enough'
                      : 'btn btn-success'
                  }
                  onClick={onClickBuy}
                >
                  {buttonText}
                </ApproveButtonStyled>
                <StyledBuyIRon>
                  <StyledLink target="_blank" href={ExternalLinks.buyIron}>
                    <StyledFontAwesomeIcon icon={faShoppingCart} />
                    Buy TITAN
                  </StyledLink>
                </StyledBuyIRon>
              </StyledPaymentBody>
            </StyledPaymentContent>
          </StyledWrapPayment>
        </StyledWrapBody>
      </Container>
    </Page>
  );
};

const StyledPaymentContent = styled.div`
  background-color: #12161e;
  border-radius: 10px;
  padding: 20px;
`;

const StyledPaymentHeader = styled.div`
  border-bottom: 1px dashed #303030;
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
`;

const StyledPaymentBody = styled.div`
  padding-top: 12px;
`;

const StyledFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  label {
    color: '#6e4242';
  }
  &.total {
    label {
      font-weight: 600;
    }
  }
`;

const StyledPaymentLabel = styled.div`
  font-size: 18px;
  text-transform: uppercase;
  font-weight: bold;
  padding: 21px 0px 15px 0;
  @media (max-width: 768px) {
    padding: 15px 0 10px 0;
  }
`;

const StyledLabel = styled.div`
  font-size: 18px;
  text-transform: uppercase;
  font-weight: bold;
`;
const StyledRole = styled.div`
  display: flex;
  align-items: center;
  margin-right: 5px;
  font-size: 15px;
  font-weight: 500;
  span {
    font-size: 16px;
    font-weight: bold;
  }
  img {
    width: 8px;
    height: 20px;
    margin-right: 8px;
  }
  .select-number {
    margin-left: auto;
  }
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: dashed 2px #303030;
  padding-bottom: 13px;
  @media (max-width: 768px) {
    display: block;
    border-bottom: none;
    padding-bottom: 0px;
  }
`;
const BuyTicketHeaderStyled = styled.div`
  display: flex;
  align-items: flex-end;
  @media (max-width: 768px) {
    border-bottom: dashed 2px ${theme.color.primary.main};
    padding-bottom: 20px;
  }
`;
const NumberTicketHeaderStyled = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 21px 0px 15px 0;
  @media (max-width: 768px) {
    padding: 15px 0 10px 0;
  }
`;

const StyledBuyMultiTicket = styled.button`
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: normal;
  border: 3px solid ${theme.color.primary.main};
  background-color: ${theme.color.orange[500]};
  cursor: pointer;
  margin-right: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 10px;
  }
`;
const BuyTicketImagetyled = styled.div`
  height: 40px;
  img {
    height: 100%;
  }
`;

const AmountStyled = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #2dfc8b;
`;

const ApproveButtonStyled = styled.button`
  margin: 15px auto;
  height: 46px !important;
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: normal;
  border: 3px solid ${theme.color.primary.main};
  cursor: pointer;
  background-color: ${theme.color.green[100]};
  &.not-enough {
    background-color: #ff9e9e;
  }
`;
const BuyTicketLabeltyled = styled.h1`
  margin: 0;
  margin-left: 12px;
  font-weight: bold;
`;
const BignumberStyled = styled.span`
  margin-left: 0;
  font-weight: 700;
`;
const TicketContainerStyled = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 768px) {
    display: block;
    margin-top: 12px;
  }
`;
const SelectTicketItemContainerStyled = styled.div`
  width: 100%;
  @media (max-width: 768px) {
    margin-bottom: 14px;
  }
`;
const AddNewTicketButtonStyled = styled.button`
  width: 100%;
  border: dashed 3px #a02029;
  font-size: 5rem;
  font-weight: 400;
  cursor: pointer;
  height: 538px;
  background-color: transparent;
  position: relative;
  &:hover {
    background-color: #a0202933;
  }
  :disabled {
    border: none;
    cursor: not-allowed;
  }
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;
const AddNewTicketButtonPlus = styled.div`
  font-size: 78px;
  font-weight: 700;
  color: #a3212a;
`;
const AddNewTicketButtonHeader = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 42px;
  line-height: 1;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  font-family: ${theme.font.heading};
  background-color: transparent;
  text-transform: uppercase;
  color: #a3212a;
  font-size: 18px;
  font-weight: 700;
`;
const StyledHeaderRight = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    display: block;
    text-align: center;
    margin-top: 12px;
  }
`;

const StyledBalance = styled.div`
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  color: #c0c0c0;
  .unit {
    font-weight: 700;
    margin-left: 5px;
  }
`;
const StyledBuyIRon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
  @media (max-width: 768px) {
    a {
      margin-left: 10px;
    }
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  margin-right: 5px;
`;
const StyledLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  justify-content: center;
  padding: 0px;
  margin-left: 15px;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  text-decoration: none;
  &:hover {
    color: #a3212a;
  }
`;

const StyledWrapBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 50px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column-reverse;
  }
`;

const StyledBody = styled.div`
  flex: 1;
  margin-right: 20px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-right: 0px;
  }
`;

const StyledWrapPayment = styled.div`
  align-self: flex-start;
  width: 25%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;
export default BuyTickets;
