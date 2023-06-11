import { AccessibleModel } from "@casl/mongoose";
import { DatabaseEnum } from "./Database";
import {
  ProfileDocument,
  SessionDocument,
  UserDocument,
  UserGroupDocument,
} from "@/schemas/Documents";

export type UserModelType = "PROFILE" | "SESSION" | "USERGROUP" | "USER";
export enum UserModelEnum {
  PROFILE = "Profile",
  SESSION = "Session",
  USERGROUP = "UserGroup",
  USER = "User",
}

export interface DatabaseUserConfig {
  name: DatabaseEnum.USER;
  models: UserModelEnum[];
}

export interface ILoadedUserModels<T extends UserModelEnum | undefined> {
  [UserModelEnum.PROFILE]: T extends UserModelEnum.PROFILE
    ? AccessibleModel<ProfileDocument>
    : undefined;
  [UserModelEnum.SESSION]: T extends UserModelEnum.SESSION
    ? AccessibleModel<SessionDocument>
    : undefined;
  [UserModelEnum.USERGROUP]: T extends UserModelEnum.USERGROUP
    ? AccessibleModel<UserGroupDocument>
    : undefined;
  [UserModelEnum.USER]: T extends UserModelEnum.USER
    ? AccessibleModel<UserDocument>
    : undefined;
}
