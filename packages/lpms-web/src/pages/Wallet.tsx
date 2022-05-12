import { useState, useMemo, useCallback, useEffect } from 'react';
import { Box, Button, Select, TextInput, TextArea, Heading } from 'grommet';
import { useAppDispatch, useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import {
  generateMnemonic,
  saveWallet,
  restoreWalletFromStorage,
  accountsListFromWallet,
  setWalletAccount,
  disconnectWallet
} from '../libs/lightWallet';
import { MessageBox, MessageLoadingBox } from '../components/MessageBox';

export const Wallet = () => {
  const dispatch = useAppDispatch();
  const {
    isConnecting,
    staticProvider,
    wallet,
    walletAccountIndex,
    provider
  } = useAppState();
  const [processing, setProcessing] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [mnemonic, setMnemonic] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<undefined | string>();

  useEffect(
    () => {
      if (provider) {
        setAccounts(accountsListFromWallet(provider));
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
        if (!staticProvider || !provider) {
          throw new Error('Provider not initialized yet');
        }

        setWalletAccount(
          dispatch,
          provider,
          staticProvider,
          selectedIndex
        );
      } catch (err) {
        setError(
          (err as Error).message || 'Unknown account selection error'
        );
      }
    },
    [dispatch, provider, staticProvider]
  );

  const encryptAndSave = useCallback(
    async () => {
      try {
        setError(undefined);
        setProcessing(true);
        await saveWallet(dispatch, mnemonic, password);
        setMnemonic('');
        setPassword('');
        setProcessing(false);
      } catch (err) {
        setError((err as Error).message || 'Unknown save error');
        setProcessing(false);
      }
    },
    [dispatch, mnemonic, password]
  );

  const unlockWallet = useCallback(
    async () => {
      try {
        setError(undefined);
        setProcessing(true);

        if (!staticProvider || !wallet || wallet === '') {
          setProcessing(false);
          return;
        }

        await restoreWalletFromStorage(
          dispatch,
          password,
          staticProvider,
          wallet,
          walletAccountIndex
        );
        setPassword('');
        setProcessing(false);
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

  if (isConnecting) {
    return (
      <div>
        Connecting
      </div>
    );
  }

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: '/',
          label: '🏠'
        }
      ]}
    >
      {isWalletUnlocked &&
        <Box
          direction='column'
          gap='small'
        >
          <Box>
            <Heading level={3}>
              Accounts
            </Heading>
            <Select
              options={accounts}
              value={accounts[walletAccountIndex]}
              onChange={({ option }) => selectAccount(accounts.indexOf(option))}
            />
          </Box>
          <Box>
            <Button
              label='Lock up the wallet'
              onClick={disconnect}
            />
          </Box>
        </Box>
      }
      {isWalletCreated && !isWalletUnlocked &&
        <Box
          direction='column'
          gap='small'
        >
          <Heading level={3}>
            Unlock the wallet
          </Heading>
          <MessageLoadingBox type='info' show={processing}>
            Unlocking...
          </MessageLoadingBox>
          <Box>
            <TextInput
              type='password'
              placeholder='encryption pin'
              disabled={processing}
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              onKeyDown={e => {
                if (e.code === 'Enter') {
                  unlockWallet();
                }
              }}
            />
          </Box>
          <Box>
            <Button
              label='Unlock'
              disabled={processing}
              onClick={unlockWallet}
            />
          </Box>
        </Box>
      }
      {!isWalletCreated &&
        <Box
          direction='column'
          gap='small'
        >
          <Heading level={3}>
            Create a new wallet
          </Heading>
          <Box>
            <TextArea
              size='large'
              disabled={processing}
              value={mnemonic}
              rows={3}
              cols={50}
              onChange={({ target }) => setMnemonic(target.value)}
            />
          </Box>
          <Box>
            <Button
              primary={mnemonic === ''}
              label='Generate a wallet mnemonic'
              disabled={processing}
              onClick={() => setMnemonic(generateMnemonic())}
            />
          </Box>
          {mnemonic !== '' && !processing &&
            <Box
              direction='column'
              gap='small'
            >
              <Box>
                <TextInput
                  type='password'
                  placeholder='wallet encryption pin'
                  disabled={processing}
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
              </Box>
              <Box>
                <Button
                  primary
                  label='Encrypt and save'
                  disabled={processing}
                  onClick={encryptAndSave}
                />
              </Box>
            </Box>
          }
          <MessageLoadingBox type='info' show={processing}>
            Storing the wallet...
          </MessageLoadingBox>
        </Box>
      }
      <MessageBox type='error' show={!!error}>
        {error}
      </MessageBox>
    </PageWrapper>
  );
};
