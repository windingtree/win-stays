#!/usr/bin/env -S node --no-deprecation

import { Command } from 'commander';
import { red } from 'kleur';
import pack from '../package.json';
import { configController } from './api/config';
import { mnemonicController } from './api/mnemonic';
import { loginController } from './api/login';
import { walletController } from './api/wallet';
import { storageController } from './api/storage';
import { addressesController } from './api/addresses';
import { serviceProviderController } from './api/serviceProvider';
import { saltController } from './api/salt';

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
  .option('--get <property>', 'view a specific property value')
  .option('--add <property>', 'specify a property to add')
  .option('--value <value>', 'specify a property value to add')
  .option('--remove <property>', 'specify a property to remove from config')
  .action(configController);

program
  .command('mnemonic')
  .description('Generates random 24 word mnemonic')
  .option('--save', 'save generated mnemonic to config')
  .option('--index <index>', 'specifies the default account index. "0" by default')
  .action(mnemonicController);

program
  .command('salt')
  .description('Returns a random salt string (bytes32)')
  .option('--save', 'save generated salt to config')
  .action(saltController);

program
  .command('wallet')
  .description('Wallet account information')
  .option('--index <index>', 'specifies an account index to show. "0" by default')
  .option('--keys', 'export public and private keys of account by index')
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
  .option('--save', 'save uploaded metadata file URI')
  .action(storageController);

program
  .command('addresses')
  .description('Returns addresses of service provider roles')
  .action(addressesController);

program
  .command('sp')
  .description('Service provider operations')
  .option('--id', 'returns a service provider Id based on salt and owner address')
  .option('--salt <salt>', 'specify a salt string')
  .option('--meta <metadata_uri>', 'specify an URI of service provider\'s metadata')
  .option('--register', 'initiate registration of service provider')
  .option('--update', 'initiate dataURI update of service provider')
  .option('--reset', 'wipe saved information about the registered service provider')
  .action(serviceProviderController);

program.parse();
