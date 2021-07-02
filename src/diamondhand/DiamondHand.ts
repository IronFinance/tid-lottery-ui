import { Configuration } from './config';
import { BigNumber } from '@ethersproject/bignumber';
import { Signer } from '@ethersproject/abstract-signer';
import { Overrides } from '@ethersproject/contracts';
import { JsonRpcProvider, Provider } from '@ethersproject/providers';
import { Lottery } from './Lottery';
import IRON from './TITAN';
import { Ticket } from './Ticket';
import { Call, multicall } from './multicall';
import LINK from './LINK';
import { TaxService } from './TaxService';
import { ConfigurationInfo } from './types';
import ERC20 from './ERC20';

/**
 * An API module of Diamond Hand contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class DiamondHand {
  myAccount: string;
  private defaultProvider: JsonRpcProvider;
  private signer?: Signer;
  private config: Configuration;
  private lottery: Lottery;
  private titan: IRON;
  private collateralTokens: ERC20[];
  private link: LINK;
  private ticket: Ticket;
  private taxService: TaxService;
  private multicallAddress: string;

  constructor(cfg: Configuration, web3Provider: JsonRpcProvider, account?: string) {
    const provider = account ? web3Provider.getSigner(account) : web3Provider;
    this.defaultProvider = web3Provider;
    this.myAccount = account;
    const { abis, addresses, collateralTokens } = cfg;
    this.lottery = new Lottery(abis.Lottery, addresses.Lottery, provider, this);
    this.ticket = new Ticket(abis.Ticket, addresses.Ticket, provider);
    this.taxService = new TaxService(abis.TaxService, addresses.TaxService, provider);
    this.config = cfg;
    this.multicallAddress = cfg.addresses.Multicall;
    this.titan = new IRON(abis.Titan, addresses.Titan, provider, 'IRON');
    this.link = new LINK(abis.Link, addresses.Link, provider, 'LINK');
    this.collateralTokens = [];
    for (const [symbol, [address, decimal]] of Object.entries(collateralTokens)) {
      this.collateralTokens.push(new ERC20(address, provider, symbol, decimal));
    }
  }

  public multicall(calls: Call[]) {
    return multicall(this.defaultProvider, this.multicallAddress, calls);
  }

  public get provider(): Signer | Provider {
    return this.signer || this.defaultProvider;
  }
  public getCollateralTokens() {
    return this.collateralTokens;
  }

  public getTokenByAddress(address: string) {
    return this.collateralTokens.find((t) => t.address == address);
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: JsonRpcProvider, account: string) {
    let signer: Signer | JsonRpcProvider;

    if (account) {
      signer = provider.getSigner(account);
      this.signer = provider.getSigner(account);
    } else {
      signer = provider;
      this.signer = null;
    }

    this.myAccount = account;
    this.reconnect(signer);
  }

  lock(provider: any) {
    this.signer = null;
    this.myAccount = null;
    this.reconnect(provider);
  }

  private reconnect(signer: any) {
    const contracts = [
      this.lottery,
      this.ticket,
      this.titan,
      ...Object.values(this.collateralTokens),
    ];
    for (const c of contracts) {
      if (c) {
        c.connect(signer);
      }
    }
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  get LOTTERY() {
    return this.lottery;
  }

  get TICKET() {
    return this.ticket;
  }

  get IRON() {
    return this.titan;
  }

  get LINK() {
    return this.link;
  }

  get TAXSERVICE() {
    return this.taxService;
  }

  async getInfo() {
    const { addresses } = this.config;
    const [
      [jackPotDistribution],
      [matchFourDistribution],
      [matchThreeDistribution],
      [taxRate],
      [costPerTicket],
      [maxValidRange],
      [powerBallRange],
      [reservePoolRatio],
      [burnTitanRatio],
      [revervePoolBalance],
      [randomNumberGeneratorBalance],
    ] = await this.multicall([
      {
        contract: this.LOTTERY.contract,
        method: 'prizeDistribution_',
        params: [0],
      },
      {
        contract: this.LOTTERY.contract,
        method: 'prizeDistribution_',
        params: [1],
      },
      {
        contract: this.LOTTERY.contract,
        method: 'prizeDistribution_',
        params: [2],
      },
      {
        contract: this.LOTTERY.contract,
        method: 'taxRate_',
      },
      {
        contract: this.LOTTERY.contract,
        method: 'costPerTicket_',
      },
      {
        contract: this.LOTTERY.contract,
        method: 'maxValidRange_',
      },
      {
        contract: this.LOTTERY.contract,
        method: 'powerBallRange_',
      },
      {
        contract: this.TAXSERVICE.contract,
        method: 'reservePoolRatio_',
      },
      {
        contract: this.TAXSERVICE.contract,
        method: 'burnTitanPoolRatio_',
      },
      {
        contract: this.IRON.contract,
        method: 'balanceOf',
        params: [addresses.PrizeReservePool],
      },
      {
        contract: this.LINK.contract,
        method: 'balanceOf',
        params: [addresses.RandomNumberGenerator],
      },
    ]);
    return {
      jackPotDistribution: jackPotDistribution.div(1e4).toNumber(),
      matchFourDistribution: matchFourDistribution.div(1e4).toNumber(),
      matchThreeDistribution: matchThreeDistribution.div(1e4).toNumber(),
      taxRate: taxRate.div(1e4).toNumber(),
      costPerTicket,
      maxValidRange,
      powerBallRange,
      reservePoolRatio,
      burnTitanRatio,
      revervePoolBalance,
      randomNumberGeneratorBalance,
    } as ConfigurationInfo;
  }

  gasOptions(gas: BigNumber): Overrides {
    const multiplied = Math.floor(gas.toNumber() * this.config.gasLimitMultiplier);
    console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
    return {
      gasLimit: BigNumber.from(multiplied),
    };
  }
}
