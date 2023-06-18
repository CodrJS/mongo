export type MongooseConnectionEvent =
  | "open"
  | "close"
  | "reconnected"
  | "disconnected";
