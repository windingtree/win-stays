import { ethers, utils, Wallet } from 'ethers';
import { walletAccount, walletAccounts } from '../types';
import { walletPassphrase } from '../config';
import DBService from './DBService';
import { Level } from 'level';

export default class WalletService {
  protected db: Level;

  constructor() {
    this.db = DBService.getInstance().getDB();
  }

  public async createNewWallet(): Promise<void> {
    const wallet = ethers.Wallet.createRandom();
    const encodedWallet = await wallet.encrypt(walletPassphrase);

    await this.db.put('wallet', encodedWallet);
  }

  public async getWallet(): Promise<Wallet> {
    const encodedWallet = await this.db.get('wallet');
    return await ethers.Wallet.fromEncryptedJson(encodedWallet, walletPassphrase);
  }

  public accountsListFromMnemonic(mnemonic: string): Array<walletAccount> {
    const hdNode = utils.HDNode.fromMnemonic(mnemonic);

    return walletAccounts
      .map((_, index) => hdNode.derivePath(
        `m/44'/60'/0'/0/${index}`
      ))
      .map((n, index) => {
        return {
          id: index,
          role: walletAccounts[index],
          address: n.address
        };
      });
  }

  public async getWalletAccounts(): Promise<walletAccount[]> {
    const wallet = await this.getWallet();

    return this.accountsListFromMnemonic(wallet.mnemonic.phrase);
  }

  public async getWalletAccountByRole(role): Promise<string> {
    const addresses = await this.getWalletAccounts();
    const address = addresses.find(v => v.role === role);

    return address?.address || '';
  }
}
