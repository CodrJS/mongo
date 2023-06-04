import { DatabaseEnum } from "./Database";

export type UserModelType = "PROFILE" | "SESSION" | "USERGROUP" | "USER";
export enum UserModelEnum {
  PROFILE = "Profile",
  SESSION = "Session",
  USERGROUP = "UserGroup",
  USER = "User",
}

export interface DatabaseUserConfig {
  name: DatabaseEnum.USER;
  models?: UserModelEnum[];
}
