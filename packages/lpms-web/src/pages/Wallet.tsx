import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import { utils } from 'ethers';
import {
  generateMnemonic,
  saveWallet,
  restoreWalletFromStorage,
  accountsListFromWallet,
  setWalletAccount,
  disconnectWallet
} from '../libs/lightWallet';
import { usePoller } from '../hooks/usePoller';

export const Wallet = () => {
  const dispatch = useAppDispatch();
  const {
    isConnecting,
    staticProvider,
    wallet,
    walletAccountIndex,
    provider,
    account
  } = useAppState();
  const [processing, setProcessing] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [mnemonic, setMnemonic] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [error, setError] = useState<undefined | string>();

  useEffect(
    () => {
      if (provider) {
        setAccounts(accountsListFromWallet(provider));
      }
    },
    [provider]
  );

  const getBalance = useCallback(
    () => {
      if (provider) {
        provider
          .getBalance()
          .then(balance => setBalance(utils.formatEther(balance)))
          .catch(console.error);
      } else {
        setBalance('');
      }
    },
    [provider]
  );

  const disconnect = useCallback(
    () => {
      disconnectWallet(dispatch);
    },
    [dispatch]
  );

  const selectAccount = useCallback(
    (selectedIndex: number) => {
      try {
        setWalletAccount(dispatch, provider, selectedIndex);
      } catch (err) {
        setError(
          (err as Error).message || 'Unknown account selection error'
        );
      }
    },
    [dispatch, provider]
  );

  const encryptAndSave = useCallback(
    () => {
      try {
        setError(undefined);
        setProcessing(true);
        saveWallet(dispatch, mnemonic, password)
          .finally(() => {
            setMnemonic('');
            setPassword('');
            setProcessing(false);
          });
      } catch (err) {
        setError((err as Error).message || 'Unknown save error');
        setProcessing(false);
      }
    },
    [dispatch, mnemonic, password]
  );

  const unlockWallet = useCallback(
    () => {
      try {
        setError(undefined);
        setProcessing(true);

        if (!staticProvider || !wallet || wallet === '') {
          setProcessing(false);
          return;
        }

        restoreWalletFromStorage(
          dispatch,
          password,
          staticProvider,
          wallet,
          walletAccountIndex
        )
          .finally(() => {
            setPassword('');
            setProcessing(false);
          });
      } catch (err) {
        setError((err as Error).message || 'Unknown unlock wallet error');
        setProcessing(false);
      }
    },
    [dispatch, password, staticProvider, wallet, walletAccountIndex]
  );

  const isWalletCreated = useMemo(
    () => wallet && wallet !== '',
    [wallet]
  );

  const isWalletUnlocked = useMemo(
    () => wallet && wallet !== '' && provider,
    [wallet, provider]
  );

  usePoller(
    getBalance,
    !!provider,
    2000,
    'Account balance'
  );

  if (isConnecting) {
    return (
      <div>
        Connecting
      </div>
    );
  }

  return (
    <PageWrapper>
      {isWalletUnlocked &&
        <div>
          <div>
            Selected account: {account} ({balance} ETH)
          </div>
          <div>
            <button
              onClick={disconnect}
            >
              Disconnect
            </button>
          </div>
          <div>
            Accounts:
          </div>
          <div>
            <select
              value={walletAccountIndex}
              onChange={({ target }) => {selectAccount(Number(target.value))}}
            >
              {accounts.map(
                (a, index) => (
                  <option
                    key={index}
                    value={index}
                  >
                    {a}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      }
      {isWalletCreated && !isWalletUnlocked &&
        <div>
          <div>
            Unlock the wallet
          </div>
          {processing &&
            <div>
              Processing...
            </div>
          }
          {!processing &&
            <>
              <div>
                <input
                  type='password'
                  placeholder='encryption pin'
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
              </div>
              <div>
                <button
                  onClick={unlockWallet}
                >
                  Unlock
                </button>
              </div>
            </>
          }
        </div>
      }
      {!isWalletCreated &&
        <div>
          <div>
            Create a new wallet
          </div>
          <div>
            <textarea
              value={mnemonic}
              rows={4}
              cols={50}
              onChange={({ target }) => setMnemonic(target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => setMnemonic(generateMnemonic())}
            >
              Generate mnemonic
            </button>
          </div>
          {processing &&
            <div>
              Processing...
            </div>
          }
          {mnemonic !== '' && !processing &&
            <div>
              <div>
                <input
                  type='password'
                  placeholder='encryption pin'
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
              </div>
              <div>
                <button
                  onClick={encryptAndSave}
                >
                  Encrypt and save
                </button>
              </div>
            </div>
          }
        </div>
      }
      {error &&
        <div>
          <div>Error:</div>
          <div>
            {error}
          </div>
        </div>
      }
    </PageWrapper>
  );
};
