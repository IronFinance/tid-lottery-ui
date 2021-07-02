import { faExternalLink } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { useConfiguration } from '../../contexts/ConfigProvider/ConfigProvider';
import { ButtonAction } from '../ButtonAction';
import Modal, { ModalCloseButton, ModalHeader, ModalTitle } from '../Modal';
import { StyledLoaderContainer } from '../WaitingApproval/WaitingApproval';
import { Gif } from '../Gif/Gif';
import { faTimes } from '@fortawesome/pro-light-svg-icons';

export interface WaitingApprovalResultProps {
  onDismiss?: () => void;
  transactionHash: string;
}

const WaitingApprovalResult: React.FC<WaitingApprovalResultProps> = ({
  transactionHash,
  onDismiss,
}) => {
  const config = useConfiguration();

  return (
    <Modal size="sm" padding="0">
      <ModalHeader>
        <ModalTitle>Transaction Submitted</ModalTitle>
        <ModalCloseButton onClick={onDismiss}>
          <FontAwesomeIcon icon={faTimes} />
        </ModalCloseButton>
      </ModalHeader>
      <StyledModalContent>
        <StyledLoaderContainer>
          <Gif src="/loading-dragon.gif" />
        </StyledLoaderContainer>
        <StyledView href={`${config.etherscanUrl}/tx/${transactionHash}`} target="_blank">
          View on Explorer&nbsp;
          <FontAwesomeIcon icon={faExternalLink} />
        </StyledView>
        <ButtonAction onClick={onDismiss}>Close</ButtonAction>
      </StyledModalContent>
    </Modal>
  );
};

const StyledModalContent = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-gap: 5px;
  grid-template-rows: 1fr;
  align-items: center;
  padding: 20px 20px 20px 20px;
`;

const StyledView = styled.a`
  font-size: 13px;
  text-align: center;
  color: ${(props) => props.theme.color.primary.main};
  font-weight: 400;
  margin-bottom: 20px;
  text-decoration: none !important;
  :hover {
    color: ${(props) => props.theme.color.orange[600]};
  }
`;

export default WaitingApprovalResult;
