import chalk from 'chalk';

const log = console.log;

export const green = (string: string): void => log(chalk.green(string));
