#!/usr/bin/env -S node --no-deprecation

import { Command } from 'commander';
import pack from '../package.json';
import { green } from './utils/print';
import { generateMnemonic } from './api/mnemonic';

const program = new Command();

program
  .name('lpms')
  .description('LPMS API CLI')
  .version(pack.version);

program
  .command('mnemonic')
  .description('Generates random 24 word mnemonic')
  .action(() => {
    green(generateMnemonic());
  });

program.parse();
