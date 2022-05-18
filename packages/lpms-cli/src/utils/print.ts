import kleur from 'kleur';

const log = console.log;

export const red = (text: string | number): void => log(kleur.red(text));

export const green = (text: string | number): void => log(kleur.green(text));

export const yellow = (text: string | number): void => log(kleur.yellow(text));
