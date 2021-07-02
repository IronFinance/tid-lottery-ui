import React from 'react';

import TITANLogo from 'src/assets/img/tokens/TITAN.png';
import NoLogo from 'src/assets/img/no_name.png';
import styled from 'styled-components';

const logosBySymbol: { [title: string]: string } = {
  TITAN: TITANLogo,
  NOLOGO: NoLogo,
};

type TokenSymbolProps = {
  symbol: string;
  size?: number;
  noBorder?: boolean;
};

const TokenSymbol: React.FC<TokenSymbolProps> = ({ symbol, size = 64, noBorder = false }) => {
  return (
    <StyleImage
      src={logosBySymbol[symbol] ? logosBySymbol[symbol] : logosBySymbol['NOLOGO']}
      alt={`${symbol} Logo`}
      height={size}
      noBorder={noBorder}
    />
  );
};

export default TokenSymbol;

const StyleImage = styled.img<{ noBorder?: boolean }>``;
