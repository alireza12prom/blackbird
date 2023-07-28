"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFailedException = void 0;
const base_1 = require("./base");
const constants_1 = require("../constants");
class RegisterFailedException extends base_1.BaseException {
    constructor(reason) {
        super(reason, constants_1.ErrorCodesConstants.REGISTER_FAILD);
    }
}
exports.RegisterFailedException = RegisterFailedException;
//# sourceMappingURL=register.faild.js.map