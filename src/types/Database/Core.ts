import { DatabaseEnum } from ".";

export enum CoreModelEnum {
  CONFIG = "Config",
  AUDIT = "Audit",
}
export type CoreModelType = keyof typeof CoreModelEnum;
export type CoreModels = `${CoreModelEnum}`;

export interface DatabaseCoreConfig {
  name: DatabaseEnum.CORE;
  models: CoreModelEnum[];
}
