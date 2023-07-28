"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = exports.detachHostFromPort = exports.digest = void 0;
const url_parse_1 = __importDefault(require("url-parse"));
const valid_url_1 = __importDefault(require("valid-url"));
const urlJoin = __importStar(require("url-join-ts"));
function digest({ url }) {
    let { pathname, host, origin, hostname } = new url_parse_1.default(url);
    return {
        hostname: host,
        path: pathname,
        host: hostname,
        isValid: valid_url_1.default.isWebUri(url) ? true : false,
        url: origin + pathname,
    };
}
exports.digest = digest;
function detachHostFromPort(hostname) {
    const [host, port] = hostname.split(':');
    return { host, port: port || '80' };
}
exports.detachHostFromPort = detachHostFromPort;
/**
 * @description
 *  1. the `sourcePath` shoud start with `incomePath`
 *  otherwise the result will be `targetPath`
 *
 *  2. the returned path always containt `/` at the first.
 * @example
 *  let incomePath = '/well/done/okey'
 *  let sourcePath = '/well/done'
 *  let targetPath = '/'
 *
 *  let result = targetPath + '/okey'
 *
 */
function merge({ incomePath, sourcePath, targetPath }) {
    if (!incomePath.startsWith(sourcePath))
        return '';
    const longPath = incomePath.split('/').filter((s) => s != '');
    const shortPath = sourcePath.split('/').filter((s) => s != '');
    return (urlJoin.urlJoin('/' + targetPath, longPath.slice(shortPath.length).join('/')) || '/');
}
exports.merge = merge;
//# sourceMappingURL=url.js.map