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
   * A trade v2 event for the user margin account.
   */
  TRADEV2,
  /**
   * An OrderComplete event for the user margin account.
   * Happens when an order is either fully filled or cancelled
   */
  ORDERCOMPLETE,
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

export function eventTypeToString(event: EventType) {
  switch (event) {
    case EventType.EXCHANGE:
      return "EXCHANGE";
    case EventType.EXPIRY:
      return "EXPIRY";
    case EventType.USER:
      return "USER";
    case EventType.CLOCK:
      return "CLOCK";
    case EventType.GREEKS:
      return "GREEKS";
    case EventType.TRADE:
      return "TRADE";
    case EventType.TRADEV2:
      return "TRADEV2";
    case EventType.ORDERCOMPLETE:
      return "ORDERCOMPLETE";
    case EventType.ORDERBOOK:
      return "ORDERBOOK";
    case EventType.ORACLE:
      return "ORACLE";
    default:
      throw Error("Invalid event type");
  }
}
