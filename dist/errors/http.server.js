"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServerException = void 0;
const base_1 = require("./base");
const constants_1 = require("../constants");
class HttpServerException extends base_1.BaseException {
    constructor(reason) {
        super(reason, constants_1.ErrorCodesConstants.HTTP_SERVER);
    }
}
exports.HttpServerException = HttpServerException;
//# sourceMappingURL=http.server.js.map