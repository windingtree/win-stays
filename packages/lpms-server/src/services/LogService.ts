import kleur from 'kleur';

export default class LogService {
  log = console.log;

  static red(text: string | number): void {
    console.log(kleur.red(text));
  }

  static yellow(text: string | number): void {
    console.log(kleur.yellow(text));
  }

  static green(text: string | number): void {
    console.log(kleur.green(text));
  }
}
