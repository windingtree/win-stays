import { expect } from 'chai';
import { utils } from 'ethers';

import { generateMnemonic } from '../src/api/mnemonic';

describe('LPMS CLI', async () => {

  describe('#generateMnemonic', () => {

    it('should generate valid mnemonic', async () => {
      expect(utils.isValidMnemonic(generateMnemonic())).to.be.true;
    });
  });
});
