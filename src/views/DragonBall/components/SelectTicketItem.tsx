import React, { useCallback, useMemo } from 'react';
import { TicketItemProp } from 'src/api/models';
import styled from 'styled-components';
import theme from 'src/theme';
import ImgBallSelected from 'src/assets/img/ball-selected.svg';
import ImgBallNoSelected from 'src/assets/img/ball-no-selected.svg';
import ImgBallPower from 'src/assets/img/ball-power.svg';
import IconRandom from 'src/assets/img/ic-dice.svg';
import IconRemove from 'src/assets/img/remove.svg';
import { range } from 'src/utils/objects';
import { rand } from './BuyLottery';

const maxChooseNumber = 4;

const slots = range(0, 4);

interface TicketItemProps {
  index: number;
  max: number;
  powerBallMax: number;
  ticketItem: TicketItemProp;
  onChange?: (index: number, data: TicketItemProp) => void;
  removeTicket: (index: number) => void;
}

const SelectTicketItem: React.FC<TicketItemProps> = ({
  index,
  max,
  powerBallMax,
  ticketItem,
  onChange,
  removeTicket,
}) => {
  const normalNumberArray = useMemo(() => range(1, 1 + max), [max]);
  const powerNumberArray = useMemo(() => range(1, 1 + powerBallMax), [powerBallMax]);

  const onSelect = useCallback(
    (number: number) => {
      let selected = ticketItem.selectedNumbers;
      if (selected.includes(number)) {
        selected = selected.filter((x) => x !== number);
      } else if (selected.length < maxChooseNumber) {
        selected = [...selected, number];
      }

      onChange(index, {
        ...ticketItem,
        selectedNumbers: selected,
      });
    },
    [index, onChange, ticketItem],
  );

  const selectPowerNumber = useCallback(
    (n) => {
      if (ticketItem.selectedPowerNumber === n) {
        return;
      }
      onChange(index, {
        ...ticketItem,
        selectedPowerNumber: ticketItem.selectedPowerNumber === n ? undefined : n,
      });
    },
    [index, onChange, ticketItem],
  );

  const randomTicket = useCallback(() => {
    const randomData = rand(4, max, powerBallMax);

    onChange(index, {
      ...ticketItem,
      selectedNumbers: randomData.slice(0, 4),
      selectedPowerNumber: randomData[4],
    });
  }, [index, max, onChange, powerBallMax, ticketItem]);

  const isValid = useMemo(() => {
    return (
      ticketItem && ticketItem.selectedNumbers.length > 3 && ticketItem.selectedPowerNumber > 0
    );
  }, [ticketItem]);

  const handleRemove = useCallback(() => {
    removeTicket(index);
  }, [index, removeTicket]);

  return (
    <ContainerItem>
      <HeaderStyled active={isValid}>
        <TicketNumberStyled>OFFERING {index + 1}</TicketNumberStyled>
        <RandomButtonStyled onClick={randomTicket}>
          <img src={IconRandom} draggable="false" />
        </RandomButtonStyled>
        <IconRemoveStyled className="fal fa-minus-circle" onClick={handleRemove}>
          <img src={IconRemove} draggable="false" />
        </IconRemoveStyled>
      </HeaderStyled>
      <SelectedBallContainerStyled>
        {slots.map((i) => {
          return (
            <BallStyled key={i} selected={!!ticketItem.selectedNumbers[i]}>
              {ticketItem.selectedNumbers[i] || ''}
            </BallStyled>
          );
        })}
        <BallStyled selected={ticketItem.selectedPowerNumber > 0} isPower={true}>
          {ticketItem.selectedPowerNumber ? ticketItem.selectedPowerNumber : ''}
        </BallStyled>
      </SelectedBallContainerStyled>
      <NormalBallContainerStyted>
        <SelectBumberLabelStyled>Choose 4 numbers</SelectBumberLabelStyled>
        <NumberChoosenStyled>
          {normalNumberArray?.map((key: number) => (
            <Ball
              key={key}
              number={key}
              selected={ticketItem.selectedNumbers.includes(key)}
              disabled={
                !ticketItem.selectedNumbers.includes(key) &&
                ticketItem.selectedNumbers.length === maxChooseNumber
              }
              onSelect={onSelect}
            />
          ))}
        </NumberChoosenStyled>
      </NormalBallContainerStyted>
      <NormalBallContainerStyted className="power">
        <SelectBumberLabelStyled>Choose 1 number</SelectBumberLabelStyled>
        <NumberChoosenStyled>
          {powerNumberArray?.map((n) => (
            <Ball
              key={n}
              number={n}
              disabled={ticketItem.selectedPowerNumber === n}
              selected={ticketItem.selectedPowerNumber === n}
              onSelect={selectPowerNumber}
              className="power"
            />
          ))}
        </NumberChoosenStyled>
      </NormalBallContainerStyted>
    </ContainerItem>
  );
};

const Ball = ({
  number,
  selected,
  disabled,
  onSelect,
  className,
}: {
  number: number;
  selected: boolean;
  disabled: boolean;
  onSelect: (x: number) => void;
  className?: string;
}) => {
  const handleClick = useCallback(() => {
    onSelect(number);
  }, [onSelect, number]);
  return (
    <ButtonStyled>
      <ButtonNumberStyled
        className={className}
        selected={selected}
        isDisable={disabled}
        onClick={handleClick}
      >
        {number}
      </ButtonNumberStyled>
    </ButtonStyled>
  );
};

const ContainerItem = styled.div`
  border: solid 1px #7c7a7a;
  background-color: #15161c;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;
const HeaderStyled = styled.div<{ active?: boolean }>`
  display: flex;
  padding: 8px 12px;
  align-items: center;
  background-color: ${({ active }) => (active ? '#4024d5' : '#16284e')};
  color: #ffffff;
`;
const TicketNumberStyled = styled.h3`
  font-weight: bold;
  font-size: 1rem;
  flex: 1;
  margin: 0;
`;
const SelectedBallContainerStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  margin: 0 18px;
  align-items: center;
  border-bottom: dashed 1px #303030;
`;

const IconRemoveStyled = styled.div`
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-left: 10px;
`;
const RandomButtonStyled = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 5px;
`;
const BallStyled = styled.div<{ selected?: boolean; isPower?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: ${({ selected }) => (selected ? theme.color.black : theme.color.primary.main)};
  background-image: ${({ selected, isPower }) =>
    `url(` + (selected ? (isPower ? ImgBallPower : ImgBallSelected) : ImgBallNoSelected) + `)`};

  @media (max-width: 768px) {
    width: 37px;
    height: 37px;
    background-repeat: no-repeat;
    background-size: contain;
  }
`;

const NormalBallContainerStyted = styled.div`
  padding: 15px 18px;
  border-bottom: dashed 1px ${theme.color.grey[500]};
  &.power {
    background-color: #232429;
    border-bottom: none;
  }
`;

const ButtonNumberStyled = styled.div<{ isDisable?: boolean; selected?: boolean }>`
  width: 100%;
  height: 100%;
  font-size: 14px;
  align-items: center;
  display: flex;
  justify-content: center;
  border: solid 1px ${(p) => (p.selected ? '#ff7f33' : '#303030')};
  cursor: ${({ isDisable }) => (!isDisable ? 'pointer' : 'unset')};
  font-weight: ${(p) => (p.selected ? 700 : 400)};
  background-color: ${(p) => (p.selected ? '#ff7f33' : '')};
  border-radius: 3px;

  &:hover {
    ${({ isDisable }) =>
      !isDisable &&
      `
        background-color: #ff7f33;
        font-weight: 700;
        border: solid 1px #ff7f33;
      `}
  }

  &.power {
    &:hover {
      ${({ isDisable }) =>
        !isDisable &&
        `
          background-color: ${theme.color.orange[500]};
        `}
    }
    background-color: ${(p) => (p.selected ? p.theme.color.orange[500] : '')} !important;
  }
`;
const ButtonStyled = styled.div`
  width: 28px;
  height: 28px;
  margin-right: 6px;
  margin-bottom: 6px;
  text-align: center;
  display: inline-block;
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const NumberChoosenStyled = styled.div`
  margin-right: -6px;
`;

const SelectBumberLabelStyled = styled.div`
  font-weight: 600;
  margin-bottom: 9px;
  font-size: 14px;
`;
export default SelectTicketItem;
