"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idlErrors = exports.parseIdlErrors = void 0;
const zeta_json_1 = __importDefault(require("./idl/zeta.json"));
function parseIdlErrors(idl) {
    const errors = new Map();
    if (idl.errors) {
        idl.errors.forEach((e) => {
            var _a;
            let msg = (_a = e.msg) !== null && _a !== void 0 ? _a : e.name;
            errors.set(e.code, msg);
        });
    }
    return errors;
}
exports.parseIdlErrors = parseIdlErrors;
exports.idlErrors = parseIdlErrors(zeta_json_1.default);
