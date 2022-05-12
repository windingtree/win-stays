import type { Dispatch } from "../store";
import type { StaticProvider } from "../hooks/useRpcProvider";
import { utils, Wallet } from 'ethers';
import Logger from '../utils/logger';

const logger = Logger('LightWallet');

// Generate random mnemonic (24 words)
export const generateMnemonic = () =>
  utils.entropyToMnemonic(utils.randomBytes(32));

// Extracts account list from the wallet by mnemonic
export const accountsListFromMnemonic = (mnemonic: string, count = 10): string[] => {
  const hdNode = utils.HDNode.fromMnemonic(mnemonic);

  return Array(count).fill(0)
    .map((_, index) => hdNode.derivePath(
      `m/44'/60'/0'/0/${index}`
    ))
    .map(n => n.address);
};

// Extracts account list from the wallet
export const accountsListFromWallet = (wallet: Wallet, count?: number): string[] =>
  accountsListFromMnemonic(wallet.mnemonic.phrase, count);

// Returns a wallet by account index
export const getWalletByAccountIndex = (wallet: Wallet, index: number): Wallet =>
  new Wallet(
    utils.HDNode
      .fromMnemonic(wallet.mnemonic.phrase)
      .derivePath(`m/44'/60'/0'/0/${index}`)
  );

// Decrypt encrypted json string
export const decryptWallet = (encrypted: string, password: string): Promise<Wallet> =>
  Wallet.fromEncryptedJson(encrypted, password);

// Encrypts wallet into json with password
export const encryptWallet = (wallet: Wallet, password: string): Promise<string> =>
  wallet.encrypt(password);

// Encrypts wallet by its mnemonic with password
export const encryptWalletFromMnemonic = (mnemonic: string, password: string) => {
  if (!utils.isValidMnemonic(mnemonic)) {
    const message = 'Mnemonic is not valid';
    logger.error(message);
    throw new Error(message);
  }
  return encryptWallet(
    Wallet.fromMnemonic(mnemonic),
    password
  );
};

// Saves the wallet by its mnemonic to the state
export const saveWallet = (
  dispatch: Dispatch,
  mnemonic: string,
  password: string
): Promise<void> =>
  encryptWalletFromMnemonic(mnemonic, password)
    .then(encrypted => {
      dispatch({
        type: 'SET_WALLET',
        payload: encrypted
      });
      dispatch({
        type: 'SET_WALLET_ACCOUNT_INDEX',
        payload: 0
      });
    })
    .catch(logger.error);

// Updates wallet with selected account
export const setWalletAccount = (
  dispatch: Dispatch,
  wallet: undefined | Wallet,
  staticProvider: StaticProvider,
  index = 0
): void => {
  if (wallet) {
    const newWallet = getWalletByAccountIndex(wallet, index)
      .connect(staticProvider);
    newWallet.getAddress()
      .then(address => {
        dispatch({
          type: 'SET_WALLET_PROVIDER',
          payload: newWallet
        });
        dispatch({
          type: 'SET_WALLET_ACCOUNT',
          payload: address
        });
        dispatch({
          type: 'SET_WALLET_ACCOUNT_INDEX',
          payload: index
        });
      })
      .catch(logger.error);
  }
};

// Locks up wallet
export const disconnectWallet = (dispatch: Dispatch): void => {
  dispatch({
    type: 'SET_WALLET_PROVIDER',
    payload: undefined
  });
  dispatch({
    type: 'SET_WALLET_ACCOUNT',
    payload: undefined
  });
};

// Restores a wallet from storage to the state
export const restoreWalletFromStorage = async (
  dispatch: Dispatch,
  password: string,
  staticProvider: StaticProvider,
  encryptedWallet: string,
  walletAccountIndex: number
): Promise<void> => {
  const decryptedWallet = await Wallet
    .fromEncryptedJson(encryptedWallet, password);
  setWalletAccount(
    dispatch,
    decryptedWallet,
    staticProvider,
    walletAccountIndex
  );
}
