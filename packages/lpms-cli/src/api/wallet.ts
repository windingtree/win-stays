import type { ActionController } from '../types';
import { utils, Wallet, providers } from 'ethers';
import { requiredConfig, getConfig } from './config';
import { green } from '../utils/print';

export const getWalletByAccountIndex = (
  mnemonic: string,
  index: number,
  provider: providers.JsonRpcProvider
): Wallet =>
  new Wallet(
    utils.HDNode
      .fromMnemonic(mnemonic)
      .derivePath(`m/44'/60'/0'/0/${index}`)
  )
    .connect(provider);

export const walletController: ActionController = async (_, program) => {
  try {
    requiredConfig([
      'mnemonic',
      'providerUri'
    ]);

    const provider = new providers.JsonRpcProvider(
      getConfig('providerUri') as string
    );
    const wallet = getWalletByAccountIndex(
      getConfig('mnemonic') as string,
      0,
      provider
    );
    const accountAddress = await wallet.getAddress();
    const accountBalance = await wallet.getBalance();
    const formattedBalance = utils.formatEther(accountBalance);

    green(`Wallet account: ${accountAddress} (${formattedBalance} xDAI)`);
  } catch (error) {
    program.error(error, { exitCode: 1 });
  }
}
