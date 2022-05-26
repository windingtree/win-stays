import type { ActionController } from '../types';
import { utils } from 'ethers';
import { green, yellow } from '../utils/print';
import { saveConfig } from './config';

export const generateRandomSalt = (): string =>
  utils.keccak256(utils.randomBytes(32));

export const saltController: ActionController = async ({ save }, program) => {
  try {
    const salt = generateRandomSalt();
    green(`Random salt string: ${salt}`);

    if (save) {
      saveConfig('salt', salt);
      yellow('\nSalt has been successfully saved to the CLI config');
    }
  } catch (error) {
    program.error(error, { exitCode: 1 });
  }
};
