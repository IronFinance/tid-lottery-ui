import React from 'react';
import styled from 'styled-components';
import Spacer from '../Spacer';
import AccountButton from './AccountButton';
import imgLogo from '../../assets/img/logo.webp';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <StyledHeader>
      <StyledLeftHeader>
        <LogoLink to="/">
          <Logo src={imgLogo} />
        </LogoLink>
      </StyledLeftHeader>
      <Spacer size="xs" />
      <AccountButton />
      {/* <ButtonMore /> */}
    </StyledHeader>
  );
};
const StyledLeftHeader = styled.div`
  display: flex;
  flex: 1;
`;

const LogoLink = styled(NavLink)`
  text-decoration: none;
  @media (max-width: 768px) {
    align-items: center;
    display: flex;
  }
`;

const Logo = styled.img`
  align-self: flex-start;
  height: 50px;
  @media (max-width: 768px) {
    height: 33px;
    align-items: center;
  }
`;

const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  align-items: center;
`;

export default Header;
