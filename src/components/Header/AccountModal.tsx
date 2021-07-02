import React, { useMemo } from 'react';
import styled from 'styled-components';
import Modal, { ModalCloseButton, ModalProps } from '../Modal';
import Identicon from 'identicon.js';
import { useDisconnectAccount } from 'src/state/application/hooks';
import { useWeb3React } from '@web3-react/core';
import AccountTransactions from './AccountTransactions';
import { useConfiguration } from 'src/contexts/ConfigProvider/ConfigProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-light-svg-icons';

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const config = useConfiguration();
  const { account, deactivate } = useWeb3React();
  const disconnectAccount = useDisconnectAccount();

  const iconAccount = useMemo(() => {
    if (account) {
      const data = new Identicon(account, 48).toString();
      return `data:image/png;base64,${data}`;
    }
  }, [account]);

  const shortenAccount = useMemo(() => {
    if (account && account.length > 0) {
      return `${account.substring(0, 5)}.....${account.substring(
        account.length - 6,
        account.length,
      )}`;
    }
  }, [account]);

  const disconnect = () => {
    deactivate();
    disconnectAccount();
    onDismiss();
  };

  return (
    <Modal size="md" padding="0">
      <ModalCloseButton onClick={onDismiss}>
        <FontAwesomeIcon icon={faTimes} />
      </ModalCloseButton>
      <WalletInfo>
        <WalletInfoIcon src={iconAccount}></WalletInfoIcon>
        <WalletInfoMain>
          <AccountNumberContainer>
            <AccountNumber>{shortenAccount || ''}</AccountNumber>
          </AccountNumberContainer>
          <WalletTitle>Connected</WalletTitle>
        </WalletInfoMain>
        <GroupButton>
          <ActionDisconnect onClick={disconnect}>Disconnect</ActionDisconnect>
          <ActionBscScan href={`${config.etherscanUrl}/address/${account}`} target="_blank">
            Go to Explorer
          </ActionBscScan>
        </GroupButton>
      </WalletInfo>
      <AccountTransactions />
    </Modal>
  );
};

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 24px;
  background: ${({ theme }) => theme.color.blue[50]};
  border-bottom: solid 1px ${({ theme }) => `${theme.color.primary.main}55`};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const WalletInfoMain = styled.div`
  flex: 1;
`;
const AccountNumberContainer = styled.div`
  display: flex;
  align-items: center;
`;

const AccountNumber = styled.span`
  font-size: 20px;
  color: ${({ theme }) => theme.color.primary.main};
  font-weight: bold;
`;

const WalletInfoIcon = styled.img`
  height: 50px;
  width: auto;
  margin-right: 15px;
  flex-shrink: 0;
  border-radius: 100%;
  overflow: hidden;
`;

const WalletTitle = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.color.secondary};
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const GroupButton = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: 10px;
  }
`;

const ActionDisconnect = styled.button`
  display: flex;
  align-self: center;
  align-items: center;
  margin-left: 10px;
  background-color: transparent;
  appearance: none;
  cursor: pointer;
  font-size: 16px;
  padding: 2px 8px;
  color: ${({ theme }) => theme.color.red[500]};
  border: 3px solid ${({ theme }) => theme.color.red[500]};
  font-family: ${({ theme }) => theme.font.monospace};
  font-weight: 600;
  &:hover {
    background-color: ${(props) => props.theme.color.primary.main};
    color: ${(props) => props.theme.color.grey[200]};
  }
`;

const ActionBscScan = styled.a`
  display: flex;
  align-self: center;
  align-items: center;
  margin-left: 10px;
  appearance: none;
  cursor: pointer;
  font-size: 16px;
  padding: 2px 8px;
  color: ${({ theme }) => theme.color.primary.main};
  border: 3px solid ${({ theme }) => theme.color.primary.main};
  font-family: ${({ theme }) => theme.font.monospace};
  font-weight: 600;
  text-decoration: none;
  &:hover {
    background-color: ${(props) => props.theme.color.primary.main};
    color: ${(props) => props.theme.color.grey[200]};
  }
`;
export default AccountModal;
