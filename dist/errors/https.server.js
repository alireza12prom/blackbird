"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpsServerException = void 0;
const base_1 = require("./base");
const constants_1 = require("../constants");
class HttpsServerException extends base_1.BaseException {
    constructor(reason) {
        super(reason, constants_1.ErrorCodesConstants.HTTPS_SERVER);
    }
}
exports.HttpsServerException = HttpsServerException;
//# sourceMappingURL=https.server.js.map