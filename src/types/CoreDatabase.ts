import { DatabaseEnum } from "./Database";

export type CoreModelType = "CONFIG" | "AUDIT";
export enum CoreModelEnum {
  CONFIG = "Config",
  AUDIT = "Audit",
}

export interface DatabaseCoreConfig {
  name: DatabaseEnum.CORE;
  models?: CoreModelEnum[];
}
