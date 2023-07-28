"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = void 0;
class BaseException extends Error {
    constructor(reason, code) {
        super(reason);
        this.code = code;
    }
}
exports.BaseException = BaseException;
//# sourceMappingURL=base.js.map