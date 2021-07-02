import React, { useCallback, useEffect, useState } from 'react';
import Modal, {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalProps,
  ModalTitle,
} from 'src/components/Modal';
import NumberDisplay from 'src/components/Number';
import useDiamondHand from 'src/hooks/useDiamondHand';
import styled from 'styled-components';
import imgMulti from '../../../assets/img/img-multi.svg';
import imgTicketInput from '../../../assets/img/ic-ticket-input.svg';
import { LottoInfo } from 'src/diamondhand/Lottery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons';

type BuyMultiTicketProps = ModalProps & {
  limit: number;
  onGenerateTicket: (numberTicket: number, isRandom?: boolean) => void;
};

const BuyMultiTicketModal: React.FC<BuyMultiTicketProps> = ({
  onDismiss,
  limit,
  onGenerateTicket,
}) => {
  const diamondHand = useDiamondHand();
  const [numberTicket, setNumberTicket] = useState('');
  const [isRandom, setIsRandom] = useState(true);
  const [lottoInfo, setLottoInfo] = useState<LottoInfo | undefined>();

  useEffect(() => {
    if (!diamondHand) return;
    diamondHand?.LOTTERY?.getCurrentLottoInfo().then((data) => {
      setLottoInfo(data);
    });
  }, [diamondHand]);

  const isInputValid = (inputValue: string) => {
    if (inputValue.includes('.')) {
      return false;
    }
    if (isNaN(+inputValue)) {
      return false;
    }
    if (inputValue === undefined) {
      return false;
    }
    if (+inputValue > limit) {
      return false;
    }
    return true;
  };

  const broadcast = (_value: string) => {
    if (!isInputValid(_value)) {
      return false;
    }
    if (!isNaN(+_value)) {
      setNumberTicket(_value);
    }
  };

  const onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const _value = (event.target as HTMLInputElement).value;
    broadcast(_value);
  };

  const generate = useCallback(() => {
    onDismiss();
    onGenerateTicket(parseInt(numberTicket), isRandom);
  }, [numberTicket, onDismiss, onGenerateTicket, isRandom]);

  const onCheckboxChange = () => {
    setIsRandom((state) => !state);
  };

  return (
    <Modal size="md" padding="0">
      <ModalHeader>
        <ModalTitle>Add multiple tickets</ModalTitle>
        <ModalCloseButton onClick={onDismiss}>
          <FontAwesomeIcon icon={faTimes} />
        </ModalCloseButton>
      </ModalHeader>
      <ModalBody>
        <StyledChooseTicket>
          <img src={imgMulti} />
          You can buy upto {limit} tickets
        </StyledChooseTicket>
        <StyledBalance>
          <StyledValue>1</StyledValue>
          <span>Ticket = </span>
          <StyledValue>
            <NumberDisplay
              value={lottoInfo?.info?.costPerTicket}
              decimals={18}
              precision={0}
              keepZeros={true}
            />
          </StyledValue>
          <span>IRON</span>
        </StyledBalance>
        <StyledInputContainer>
          <StyledInput
            type="text"
            pattern="[^0-9]"
            minLength={1}
            maxLength={79}
            spellCheck={false}
            inputMode="numeric"
            onChange={(e) => onInputChange(e)}
            value={numberTicket}
            placeholder={'0'}
          />
          <img src={imgTicketInput} />
          Tickets
        </StyledInputContainer>
        <StyledSelect>
          <input type="checkbox" checked={isRandom} onChange={onCheckboxChange} />
          Randomize all tickets
        </StyledSelect>
        <StyledButton disabled={limit === 0 || !numberTicket} onClick={generate}>
          Generate
        </StyledButton>
      </ModalBody>
    </Modal>
  );
};

export default BuyMultiTicketModal;

const StyledChooseTicket = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #4d0000;
  img {
    width: 46px;
    margin-right: 10px;
  }
`;
const StyledBalance = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  .balance {
    margin-left: auto;
    font-size: 16px;
    font-weight: normal;
    color: #00a74c;
  }
`;

const StyledValue = styled.span`
  font-size: 1.1rem;
  margin: 0 4px;
  font-weight: bold;
`;

const StyledInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 18px;
  margin-top: 13px;
  font-size: 18px;
  font-weight: 600;
  color: #400003;
  border: solid 1px #400003;
  img {
    width: 40px;
    margin-right: 10px;
  }
`;

const StyledInput = styled.input`
  display: flex;
  flex: 1;
  color: #400003;
  position: relative;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  font-size: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  appearance: textfield;
  font-family: ${({ theme }) => theme.font.monospace};
  font-weight: bold;
`;

const StyledSelect = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  font-size: 18px;
  font-weight: normal;
  color: #400003;
  input {
    margin-right: 10px;
    width: 20px;
    height: 20px;
    :checked {
    }
  }
`;

const StyledButton = styled.button`
  margin-top: 23px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: normal;
  border: 3px solid ${({ theme }) => theme.color.primary.main};
  background: ${({ theme }) => theme.color.green[100]};
  cursor: pointer;
  margin-left: auto;
  :disabled {
    cursor: not-allowed;
    background: ${({ theme }) => theme.color.grey[400]};
    border: 3px solid ${({ theme }) => theme.color.grey[500]};
  }
`;
