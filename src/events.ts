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
   * A trade v3 event for the user margin account.
   */
  TRADEV3,
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
  /*
   * On pricing account change
   */
  PRICING,
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
    case EventType.TRADEV3:
      return "TRADEV3";
    case EventType.ORDERCOMPLETE:
      return "ORDERCOMPLETE";
    case EventType.ORDERBOOK:
      return "ORDERBOOK";
    case EventType.ORACLE:
      return "ORACLE";
    case EventType.PRICING:
      return "PRICING";
    default:
      throw Error("Invalid event type");
  }
}
