import { AccessibleModel } from "@casl/mongoose";
import { DatabaseEnum } from ".";
import { ProfileDocument } from "@/schemas/Profile";
import { SessionDocument } from "@/schemas/Session";
import { UserGroupDocument } from "@/schemas/UserGroup";
import { UserDocument } from "@/schemas/User";

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
  Profile: T extends "Profile" ? AccessibleModel<ProfileDocument> : never;
  Session: T extends "Session" ? AccessibleModel<SessionDocument> : never;
  UserGroup: T extends "UserGroup" ? AccessibleModel<UserGroupDocument> : never;
  User: AccessibleModel<UserDocument>;
}
