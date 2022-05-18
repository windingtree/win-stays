import chalk from 'chalk';

const log = console.log;

export const green = (string: string): void => log(chalk.green(string));

export const yellow = (string: string): void => log(chalk.yellow(string));

export const red = (string: string): void => log(chalk.red(string));
