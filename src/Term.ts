import boxen from 'boxen';
import { readFileSync } from "node:fs";
import { URL } from "node:url";
import kleur from "kleur";
import Logger from './Log.js';

export class Term {
  constructor(private log: Logger) {}

  box = (message: string) => {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.log._log(boxen(message), {
      padding: 1
    });
  }

  header(message: string) {
    const bit = kleur.blue().underline(message);
    this.log._log();
    this.log._log(bit);
    this.log._log();
  }

  appHeader() {
    let version = `?`;
    let name = `app`;
    try {
      const path = new URL(`../../package.json`, import.meta.url);
      const json = JSON.parse(readFileSync(path, `utf-8`));
      name = json.name;
      version = json.version;
    } catch (error) {
      console.error(`Could not load package.json`);
      console.error(error);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    }

    const title = `${ name } ${ version }`;

    this.log._log(kleur.gray(`-`.repeat(title.length)));
    this.log._log(kleur.blue(title));
    this.log._log(kleur.gray(`-`.repeat(title.length)));
  }

  separator() {
    this.log._log();
    this.log._log(kleur.cyan(kleur.bold(`-----`)));
    this.log._log();
  }

  emphasis(message: string) {
    const messageLines = message.split(`\n`);
    for (const m of messageLines) {
      this.log._log(m.trim());
    }
  }
}