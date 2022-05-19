#!/usr/bin/env -S node --no-deprecation

import { Command } from 'commander';
import { red } from 'kleur';
import pack from '../package.json';
import { configController } from './api/config';
import { mnemonicController } from './api/mnemonic';
import { loginController } from './api/login';
import { walletController } from './api/wallet';
import { storageController } from './api/storage';

const program = new Command();

program
  .name('lpms')
  .description('LPMS API CLI')
  .version(pack.version)
  .configureOutput({
    outputError: (str, write) => write(red(str))
  });

program
  .command('config')
  .description('Adds or removes configuration properties')
  .option('--add <property>', 'specify a property to add')
  .option('--value <value>', 'specify a property value to add')
  .option('--remove <property>', 'specify a property to remove from config')
  .action(configController);

program
  .command('mnemonic')
  .description('Generates random 24 word mnemonic')
  .option('--save', 'save generated mnemonic to config')
  .action(mnemonicController);

program
  .command('wallet')
  .description('Wallet account information')
  .action(walletController);

program
  .command('login')
  .description('Makes login with password')
  .option('--login <login>', 'specify the login')
  .option('--password <password>', 'specify the password')
  .action(loginController);

program
  .command('storage')
  .description('Uploads files to storage')
  .option('--metadata <path>', 'specify a path to the metadata file')
  .option('--file <path>', 'specify a path to the file')
  .action(storageController);

program.parse();
