"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSecureContextException = void 0;
const base_1 = require("./base");
const constants_1 = require("../constants");
class CreateSecureContextException extends base_1.BaseException {
    constructor(reason) {
        super(reason, constants_1.ErrorCodesConstants.CREATE_SECURE_CONTEXT_FAILD);
    }
}
exports.CreateSecureContextException = CreateSecureContextException;
//# sourceMappingURL=create-secure-context.faild.js.map