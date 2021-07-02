import React, { useRef, useState } from 'react';
import { ExternalLinks } from 'src/config';
import useOutsideClick from 'src/hooks/useClickOutside';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const ButtonMore: React.FC = () => {
  const [showed, setShowed] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => hide());

  const toggle = () => {
    setShowed(!showed);
  };

  const hide = () => {
    setShowed(false);
  };

  return (
    <StyledDropdown ref={ref}>
      <button className="btn btn-outline btn-icon  ml-1" onClick={toggle}>
        <FontAwesomeIcon icon={faEllipsisH} />
      </button>
      {showed && (
        <StyledDropdownContent onClick={hide}>
          <StyledDropdownItem href={ExternalLinks.codes} target="_blank">
            Codes
          </StyledDropdownItem>
          <StyledDropdownItem href={ExternalLinks.medium} target="_blank">
            Medium
          </StyledDropdownItem>
          <StyledDropdownItem href={ExternalLinks.telegram} target="_blank">
            Telegram
          </StyledDropdownItem>
          <StyledDropdownItem href={ExternalLinks.discord} target="_blank">
            Discord
          </StyledDropdownItem>
          <StyledDropdownItem href={ExternalLinks.twitter} target="_blank">
            Twitter
          </StyledDropdownItem>
        </StyledDropdownContent>
      )}
    </StyledDropdown>
  );
};

const StyledDropdown = styled.div`
  position: relative;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledDropdownContent = styled.div`
  min-width: 9rem;
  background-color: #1a1e22;
  border: solid 1px #fff;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 2.6rem;
  right: 0rem;
  z-index: 100;
`;

const StyledDropdownItem = styled.a`
  flex: 1 1 0%;
  align-items: center;
  display: flex;
  padding: 0.5rem;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
  color: #fff;
  img {
    margin-right: 10px;
    width: 24px;
    text-align: center;
  }
  &:hover {
    color: ${(p) => p.theme.color.grey[750]};
    cursor: pointer;
    text-decoration: none;
  }
`;

export default ButtonMore;
