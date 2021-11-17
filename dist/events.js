"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
var EventType;
(function (EventType) {
    /**
     * Refers to events that reflect a change in the exchange state.
     */
    EventType[EventType["EXCHANGE"] = 0] = "EXCHANGE";
    /**
     * Expiration event for a zeta group.
     */
    EventType[EventType["EXPIRY"] = 1] = "EXPIRY";
    /**
     * Events that reflect a change in user state
     * i.e. Margin account or orders
     */
    EventType[EventType["USER"] = 2] = "USER";
    /**
     * A change in the clock account.
     */
    EventType[EventType["CLOCK"] = 3] = "CLOCK";
    /**
     * A change in the greeks account.
     */
    EventType[EventType["GREEKS"] = 4] = "GREEKS";
    /**
     * A trade event for the user margin account.
     */
    EventType[EventType["TRADE"] = 5] = "TRADE";
    /**
     * An update in the orderbook.
     */
    EventType[EventType["ORDERBOOK"] = 6] = "ORDERBOOK";
    /*
     * On oracle account change.
     */
    EventType[EventType["ORACLE"] = 7] = "ORACLE";
})(EventType = exports.EventType || (exports.EventType = {}));
