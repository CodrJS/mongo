import { AccessibleModel } from "@casl/mongoose";
import { DatabaseEnum } from "./Database";
import { IProfile, ISession, IUser, IUserGroup } from "@codrjs/models";

export enum UserModelEnum {
  PROFILE = "Profile",
  SESSION = "Session",
  USERGROUP = "UserGroup",
  USER = "User",
}
export type UserModelType = keyof typeof UserModelEnum;
export type UserModels = `${UserModelEnum}`;

export interface DatabaseUserConfig {
  name: DatabaseEnum.USER;
  models: UserModels[];
}

export interface ILoadedUserModels<T extends UserModels> {
  Profile: T extends "Profile" ? AccessibleModel<IProfile> : never;
  Session: T extends "Session" ? AccessibleModel<ISession> : never;
  UserGroup: T extends "UserGroup" ? AccessibleModel<IUserGroup> : never;
  User: AccessibleModel<IUser>;
}
