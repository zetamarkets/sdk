export declare enum EventType {
    /**
     * Refers to events that reflect a change in the exchange state.
     */
    EXCHANGE = 0,
    /**
     * Expiration event for a zeta group.
     */
    EXPIRY = 1,
    /**
     * Events that reflect a change in user state
     * i.e. Margin account or orders
     */
    USER = 2,
    /**
     * A change in the clock account.
     */
    CLOCK = 3,
    /**
     * A change in the greeks account.
     */
    GREEKS = 4,
    /**
     * A trade event for the user margin account.
     */
    TRADE = 5,
    /**
     * An update in the orderbook.
     */
    ORDERBOOK = 6,
    ORACLE = 7
}
export interface OrderbookEvent {
    marketIndex: number;
}
