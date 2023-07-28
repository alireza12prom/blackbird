"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SslRepository = void 0;
class SslRepository {
    constructor() {
        this._repository = [];
    }
    get repository() {
        return this._repository;
    }
    exists({ hostname }) {
        for (const ssl of this._repository) {
            if (ssl.hostname == hostname)
                return true;
        }
        return false;
    }
    add({ hostname, secureContext }) {
        this._repository.push({ hostname, secureContext });
    }
    remove({ hostname }) {
        let removed = undefined;
        this._repository = this._repository.filter((ssl) => {
            if (ssl.hostname != hostname)
                return true;
            else {
                removed = ssl;
                return false;
            }
        });
        return removed;
    }
    find({ hostname }) {
        for (const ssl of this._repository) {
            if (ssl.hostname == hostname)
                return ssl;
        }
        return null;
    }
}
exports.SslRepository = SslRepository;
//# sourceMappingURL=ssl.repository.js.map