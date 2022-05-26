import type { ActionController } from '../types';
import { utils } from 'ethers';
import { green, yellow } from '../utils/print';
import { saveConfig } from './config';

// Generate random mnemonic (24 words)
export const generateMnemonic = () =>
  utils.entropyToMnemonic(utils.randomBytes(32));

export const mnemonicController: ActionController = ({ save, index }, program) => {
  try {
    const mnemonic = generateMnemonic();

    green(generateMnemonic());

    if (save) {
      saveConfig('mnemonic', mnemonic);
      saveConfig('defaultAccountIndex', index || 0)
      yellow('\nMnemonic has been successfully saved to the CLI config');
    }
  } catch (error) {
    program.error(error, { exitCode: 1 });
  }
};
