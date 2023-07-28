"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openIfExists = void 0;
const fs_1 = __importDefault(require("fs"));
function openIfExists(path) {
    try {
        return fs_1.default.readFileSync(path);
    }
    catch (error) {
        return undefined;
    }
}
exports.openIfExists = openIfExists;
//# sourceMappingURL=file.js.map