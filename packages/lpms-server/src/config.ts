import type { TypedDataDomain } from '@ethersproject/abstract-signer';
import dotenv from "dotenv";

dotenv.config();

const checkEnvVariables = (vars: string[]): void =>
  vars.forEach(
    variable => {
      if (
        !process.env[variable] ||
        process.env[variable] === ''
      ) {
        throw new Error(`${variable} must be provided in the ENV`);
      }
    }
  );

checkEnvVariables([
  'PORT',
  'APP_ACCESS_TOKEN_KEY',
  'APP_REFRESH_TOKEN_KEY',
  'APP_WALLET_PASSPHRASE',
  'WEB3STORAGE_KEY',
  'APP_CHAIN_ID',
  'APP_VERIFYING_CONTRACT',
  'APP_DB_DIR'
]);

export const port = Number(process.env.PORT || 5000);
export const accessTokenKey = String(process.env.APP_ACCESS_TOKEN_KEY);
export const refreshTokenKey = String(process.env.APP_REFRESH_TOKEN_KEY);
export const walletPassphrase = String(process.env.APP_WALLET_PASSPHRASE);
export const debugEnabled = Boolean(process.env.DEBUG_LPMS_SERVER);
export const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000; //30d
export const accessTokenMaxAge = 30 * 60 * 1000; //30m
export const defaultManagerLogin = 'manager';
export const defaultManagerPassword = 'winwin';
export const web3StorageKey = process.env.WEB3STORAGE_KEY as string;
export const wakuConfig = { bootstrap: { default: true } };
export const dbDir = String(process.env.APP_DB_DIR);
export const typedDataDomain: TypedDataDomain = {
  name: 'stays',
  version: '1',
  verifyingContract: String(process.env.APP_VERIFYING_CONTRACT),
  chainId: Number(process.env.APP_CHAIN_ID)
};
