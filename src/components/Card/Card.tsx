import React from 'react';
import styled from 'styled-components';
import { FadeAnimated } from '../Form';

interface CardProps {
  width?: string;
  padding?: string;
  animationDuration?: number;
  background?: string;
  border?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  width,
  padding,
  animationDuration,
  background,
  border,
}) => (
  <StyledCard
    width={width}
    padding={padding}
    animationDuration={animationDuration}
    background={background}
    border={border}
  >
    {children}
  </StyledCard>
);

Card.defaultProps = {
  animationDuration: 0,
};

type StyledCardProps = {
  width?: string;
  padding?: string;
  background?: string;
  animationDuration: number;
  border: string;
};

const StyledCard = styled(FadeAnimated)<StyledCardProps>`
  animation: fadeIn ${({ animationDuration }) => animationDuration}s;
  position: relative;
  min-width: 300px;
  width: ${({ width }) => (width ? width : 'auto')};
  background: #1a1e22;
  padding: ${({ padding }) => padding || '1rem'};
  z-index: 1;
  border: none;
  border-radius: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100% !important;
  }
`;

export default Card;
