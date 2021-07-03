import { Configuration } from './diamondhand/config';
import deploymentMainnet from './diamondhand/deployments/deployments.mainnet.json';

const configurations: { [env: string]: Configuration } = {
  mainnet: {
    chainId: 137,
    etherscanUrl: 'https://polygonscan.com/',
    defaultProvider: 'https://matic-mainnet.chainstacklabs.com',
    deployments: deploymentMainnet,
    pollingInterval: 5 * 1000,
    refreshInterval: 10 * 1000,
    defaultSlippageTolerance: 0.001,
    gasLimitMultiplier: 1.1,
    maxBalanceRefresh: 1000000,
    abis: {
      Lottery: deploymentMainnet.Lottery.abi,
      Ticket: deploymentMainnet.Ticket.abi,
      TaxService: deploymentMainnet.TaxService.abi,
    },
    addresses: {
      Lottery: deploymentMainnet.Lottery.address,
      Ticket: deploymentMainnet.Ticket.address,
      Titan: '0xaAa5B9e6c589642f98a1cDA99B9D024B8407285A',
      Link: '0xb0897686c545045aFc77CF20eC7A532E3120E0F1',
      Multicall: '0xD7A323dd2B4c111d8a790FE338eEaf1D43A49f89',
      TaxService: deploymentMainnet.TaxService.address,
      RandomNumberGenerator: deploymentMainnet.RandomNumberGenerator.address,
      PrizeReservePool: deploymentMainnet.PrizeReservePool.address,
    },
    admins: [
      '0x03DbFDC27697b311B38C1934c38bD97905C46Ed0',
      '0x62cA555de2D65f8e9D45a9B3d5C1b92aC1a64ecc',
      '0xfDde60b51F8b16f2549850741015324Da346Db46',
      '0x5AeBdE597752d689132Dc64D093ff4b09067e9e6',
      '0xa3A502569BF1bfBF7b361964d61335a7530D39e8',
      '0xD1d075DB389919a6985dDc9B32b5f3Ad6f0869cd',
    ],
    collateralTokens: {
      TITAN: ['0xaAa5B9e6c589642f98a1cDA99B9D024B8407285A', 18],
    },
  },
};

export const ExternalLinks = {
  twitter: 'https://twitter.com/IronFinance',
  codes: 'https://github.com/ironfinance',
  discord: 'https://discord.gg/HuekxzYj3p',
  medium: 'https://medium.com/@ironfinance',
  telegram: 'https://t.me/ironfinance',
  buyTitan:
    'https://app.firebird.finance/swap?outputCurrency=0xaAa5B9e6c589642f98a1cDA99B9D024B8407285A',
  rules: 'https://docs.iron.finance/products/dragonball-lottery',
};

const env: string = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';

const GATrackingCodes: Record<string, string> = {
  deployment: 'G-1WCVVE43MG',
  kovan: 'G-1WCVVE43MG',
  production: 'G-F9BRXKJ1CP',
  mainnet: 'G-F9BRXKJ1CP',
};

export const GATrackingCode = GATrackingCodes[env];

export const getDefaultConfiguration = () => {
  // config used when no ethereum detected
  return configurations[env];
};
