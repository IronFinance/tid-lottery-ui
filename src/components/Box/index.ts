import styled from 'styled-components';

export const Box = styled.div`
  background-color: #0c0d11;
  border: solid 1px #303030;
  height: 100%;
  color: #fff;
`;

export const BoxHeader = styled.div<{ bg?: string }>`
  text-transform: uppercase;
  color: #fff;
  border-bottom: solid 1px #303030;
  padding: 12px;
  background-color: ${({ bg }) => bg || '#12161e'};
  display: flex;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const BoxTitle = styled.div`
  font-family: ${({ theme }) => theme.font.heading};
  font-size: 16px;
  font-weight: 700;
`;

export const BoxAction = styled.div`
  margin-left: auto;
`;

export const BoxBody = styled.div`
  padding: 8px 15px;
`;
