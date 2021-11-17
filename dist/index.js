"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.Wallet = exports.idl = exports.events = exports.risk = exports.programTypes = exports.Oracle = exports.Errors = exports.Network = exports.instructions = exports.Client = exports.types = exports.constants = exports.Exchange = exports.utils = void 0;
// Singleton
const exchange_1 = require("./exchange");
Object.defineProperty(exports, "Exchange", { enumerable: true, get: function () { return exchange_1.exchange; } });
const client_1 = require("./client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return client_1.Client; } });
const network_1 = require("./network");
Object.defineProperty(exports, "Network", { enumerable: true, get: function () { return network_1.Network; } });
const errors_1 = require("./errors");
Object.defineProperty(exports, "Errors", { enumerable: true, get: function () { return errors_1.idlErrors; } });
const oracle_1 = require("./oracle");
Object.defineProperty(exports, "Oracle", { enumerable: true, get: function () { return oracle_1.Oracle; } });
const zeta_json_1 = __importDefault(require("./idl/zeta.json"));
exports.idl = zeta_json_1.default;
const anchor_1 = require("@project-serum/anchor");
Object.defineProperty(exports, "Wallet", { enumerable: true, get: function () { return anchor_1.Wallet; } });
const utils = __importStar(require("./utils"));
exports.utils = utils;
const constants = __importStar(require("./constants"));
exports.constants = constants;
const types = __importStar(require("./types"));
exports.types = types;
const instructions = __importStar(require("./program-instructions"));
exports.instructions = instructions;
const programTypes = __importStar(require("./program-types"));
exports.programTypes = programTypes;
const risk = __importStar(require("./risk"));
exports.risk = risk;
const events = __importStar(require("./events"));
exports.events = events;
