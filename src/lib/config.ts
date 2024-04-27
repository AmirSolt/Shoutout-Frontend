export const MAX_QUEUE_COUNT = 10

export enum OrderStatus {
    payment_pending = "payment_pending",
    payment_failed = "payment_failed",
    order_waiting = "order_waiting",
    order_complete = "order_complete",
    order_rejected = "order_rejected",
    order_cancelled = "order_cancelled",
  }