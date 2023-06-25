import { Types } from "mongoose";

export { default as MongoManager } from "./MongoManager";
export * as Types from "../types";
export * as Abilities from "../abilities";
export { Documents } from "../schemas";

export const ObjectId = Types.ObjectId;
