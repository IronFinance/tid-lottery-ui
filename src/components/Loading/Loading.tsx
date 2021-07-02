import { faCircleNotch } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

interface LoadingProps {
  height?: string;
  size?: string;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({ height, size, color }) => {
  return (
    <StyledLoadingContainer height={height} size={size} color={color}>
      <FontAwesomeIcon spin icon={faCircleNotch} />
    </StyledLoadingContainer>
  );
};

const StyledLoadingContainer = styled.div<{ height?: string; size?: string; color?: string }>`
  display: flex;
  align-items: center;
  height: ${({ height }) => height || 'auto'};
  padding: 5px 0;
  color: ${({ color, theme }) => color || theme.color.grey[300]};
  i {
    font-size: ${({ size }) => size || '1.6rem'};
  }
`;

export default Loading;
