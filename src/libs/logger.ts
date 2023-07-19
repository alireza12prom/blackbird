import chalk from 'chalk';

export class Logger {
  private __level: 0 | 1 = 1;
  constructor(private label: string, private timestamp: boolean) {}

  set level(level: 1 | 0) {
    this.__level = level;
  }

  get level() {
    return this.__level;
  }

  private print(
    data: string | object,
    sign: string,
    color: 'red' | 'yellow' | 'blue' | 'gray' | 'green'
  ) {
    // parse object to json string
    data = typeof data == 'string' ? data : JSON.stringify(data);

    // colorize the messsage
    let prefix = chalk[color](chalk.bold(`${sign} [${this.label}] `));
    if (this.timestamp) {
      prefix += chalk[color](chalk.bold(`[${new Date().toLocaleTimeString()}] `));
    }

    this.level && console.log(prefix + chalk[color](data));
  }

  warning(msg: string | object) {
    this.print(msg, '<!>', 'yellow');
  }

  error(msg: string | object) {
    this.print(msg, '<- ', 'red');
  }

  info(msg: string | object) {
    this.print(msg, '<> ', 'blue');
  }

  message(msg: string | object) {
    this.print(msg, '-> ', 'green');
  }

  log(msg: string | object) {
    this.print(msg, ' * ', 'gray');
  }
}
