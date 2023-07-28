"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor(label, timestamp) {
        this.label = label;
        this.timestamp = timestamp;
        this.__level = 1;
    }
    set level(level) {
        this.__level = level;
    }
    get level() {
        return this.__level;
    }
    print(data, sign, color) {
        // parse object to json string
        data = typeof data == 'string' ? data : JSON.stringify(data);
        // colorize the messsage
        let prefix = chalk_1.default[color](chalk_1.default.bold(`${sign} [${this.label}] `));
        if (this.timestamp) {
            prefix += chalk_1.default[color](chalk_1.default.bold(`[${new Date().toLocaleTimeString()}] `));
        }
        this.level && console.log(prefix + chalk_1.default[color](data));
    }
    warning(msg) {
        this.print(msg, '<!>', 'yellow');
    }
    error(msg) {
        this.print(msg, '<- ', 'red');
    }
    info(msg) {
        this.print(msg, '<> ', 'blue');
    }
    message(msg) {
        this.print(msg, '-> ', 'green');
    }
    log(msg) {
        this.print(msg, ' * ', 'gray');
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map