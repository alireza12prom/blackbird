export declare class Logger {
    private label;
    private timestamp;
    private __level;
    constructor(label: string, timestamp: boolean);
    set level(level: 1 | 0);
    get level(): 1 | 0;
    private print;
    warning(msg: string | object): void;
    error(msg: string | object): void;
    info(msg: string | object): void;
    message(msg: string | object): void;
    log(msg: string | object): void;
}
