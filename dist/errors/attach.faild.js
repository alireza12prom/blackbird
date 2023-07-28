"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachSSLFailedException = void 0;
const base_1 = require("./base");
const constants_1 = require("../constants");
class AttachSSLFailedException extends base_1.BaseException {
    constructor(reason) {
        super(reason, constants_1.ErrorCodesConstants.ATTACH_SSL_FAILD);
    }
}
exports.AttachSSLFailedException = AttachSSLFailedException;
//# sourceMappingURL=attach.faild.js.map