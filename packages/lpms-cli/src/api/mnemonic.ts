import { utils } from 'ethers';

// Generate random mnemonic (24 words)
export const generateMnemonic = () =>
  utils.entropyToMnemonic(utils.randomBytes(32));
