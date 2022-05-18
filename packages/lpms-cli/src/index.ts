#!/usr/bin/env -S node --no-deprecation

import { Command } from 'commander';
import chalk from 'chalk';
import pack from '../package.json';
import { configController } from './api/config';
import { mnemonicController } from './api/mnemonic';
import { loginController } from './api/login';

const program = new Command();

program
  .name('lpms')
  .description('LPMS API CLI')
  .version(pack.version)
  .configureOutput({
    outputError: (str, write) => write(chalk.red(str))
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
  .command('login')
  .description('Makes login with password')
  .option('--login <login>', 'specify the login')
  .option('--password <password>', 'specify the password')
  .action(loginController);

program.parse();
