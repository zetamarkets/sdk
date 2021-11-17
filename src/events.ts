export enum EventType {
  /**
   * Refers to events that reflect a change in the exchange state.
   */
  EXCHANGE,
  /**
   * Expiration event for a zeta group.
   */
  EXPIRY,
  /**
   * Events that reflect a change in user state
   * i.e. Margin account or orders
   */
  USER,
  /**
   * A change in the clock account.
   */
  CLOCK,
  /**
   * A change in the greeks account.
   */
  GREEKS,
  /**
   * A trade event for the user margin account.
   */
  TRADE,
  /**
   * An update in the orderbook.
   */
  ORDERBOOK,
  /*
   * On oracle account change.
   */
  ORACLE,
}

export interface OrderbookEvent {
  marketIndex: number;
}
