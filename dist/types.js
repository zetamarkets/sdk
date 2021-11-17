"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarginType = exports.positionEquals = exports.orderEquals = exports.toProductKind = exports.Kind = exports.toProgramSide = exports.Side = exports.DummyWallet = void 0;
class DummyWallet {
    constructor() { }
    async signTransaction(_tx) {
        throw Error("Not supported by dummy wallet!");
    }
    async signAllTransactions(_txs) {
        throw Error("Not supported by dummy wallet!");
    }
    get publicKey() {
        throw Error("Not supported by dummy wallet!");
    }
}
exports.DummyWallet = DummyWallet;
var Side;
(function (Side) {
    Side[Side["BID"] = 0] = "BID";
    Side[Side["ASK"] = 1] = "ASK";
})(Side = exports.Side || (exports.Side = {}));
function toProgramSide(side) {
    if (side == Side.BID)
        return { bid: {} };
    if (side == Side.ASK)
        return { ask: {} };
    throw Error("Invalid side");
}
exports.toProgramSide = toProgramSide;
var Kind;
(function (Kind) {
    Kind["UNINITIALIZED"] = "uninitialized";
    Kind["CALL"] = "call";
    Kind["PUT"] = "put";
    Kind["FUTURE"] = "future";
})(Kind = exports.Kind || (exports.Kind = {}));
function toProductKind(kind) {
    if (Object.keys(kind).includes("call"))
        return Kind.CALL;
    if (Object.keys(kind).includes("put"))
        return Kind.PUT;
    if (Object.keys(kind).includes("future"))
        return Kind.FUTURE;
    // We don't expect uninitialized.
    throw "Invalid product type";
}
exports.toProductKind = toProductKind;
function orderEquals(a, b, cmpOrderId = false) {
    let orderIdMatch = true;
    if (cmpOrderId) {
        orderIdMatch = a.orderId.eq(b.orderId);
    }
    return (a.marketIndex === b.marketIndex &&
        a.market.equals(b.market) &&
        a.price === b.price &&
        a.size === b.size &&
        a.side === b.side &&
        orderIdMatch);
}
exports.orderEquals = orderEquals;
function positionEquals(a, b) {
    return (a.marketIndex === b.marketIndex &&
        a.market.equals(b.market) &&
        a.position === b.position &&
        a.costOfTrades === b.costOfTrades);
}
exports.positionEquals = positionEquals;
var MarginType;
(function (MarginType) {
    /**
     * Margin for orders.
     */
    MarginType["INITIAL"] = "initial";
    /**
     * Margin for positions.
     */
    MarginType["MAINTENANCE"] = "maintenance";
})(MarginType = exports.MarginType || (exports.MarginType = {}));
