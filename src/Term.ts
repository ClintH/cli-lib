import boxen from 'boxen';
import {readFileSync} from "fs";
import {URL} from "url";
import kleur from "kleur";
import Logger from './Log.js';

export class Term {
  constructor(private log: Logger) {

  }

  box = (msg: string) => {
    this.log._log(boxen(msg), {
      padding: 1
    });
  }

  header(msg: string) {
    let bit = kleur.blue().underline(msg);
    this.log._log();
    this.log._log(bit);
    this.log._log();
  }

  appHeader() {
    let version = '?';
    let name = 'app';
    try {
      const path = new URL('../../package.json', import.meta.url);
      const json = JSON.parse(readFileSync(path, 'utf-8'));
      name = json.name;
      version = json.version;
    } catch (err) {
      console.error('Could not load package.json');
      console.error(err);
      process.exit(1);
    }

    const title = `${name} ${version}`;

    this.log._log(kleur.gray('-'.repeat(title.length)));
    this.log._log(kleur.blue(title));
    this.log._log(kleur.gray('-'.repeat(title.length)));
  }

  separator() {
    this.log._log();
    this.log._log(kleur.cyan(kleur.bold('-----')));
    this.log._log();
  }

  emphasis(msg: string) {
    const msgLines = msg.split('\n');
    for (let m of msgLines) {
      this.log._log(m.trim());
    }
  }
}