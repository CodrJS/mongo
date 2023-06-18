import { ProfileDocument, createProfileModel } from "@/schemas/Profile";
import { SessionDocument, createSessionModel } from "@/schemas/Session";
import UserSchema, { UserDocument } from "@/schemas/User";
import { UserGroupDocument, createUserGroupModel } from "@/schemas/UserGroup";
import { ILoadedUserModels, UserModelEnum, UserModels } from "@/types";
import { AccessibleModel } from "@casl/mongoose";
import type { Connection } from "mongoose";

export default function userDatabaseSetup(
  database: Connection,
  use: Record<UserModels, boolean>,
  loaded: ILoadedUserModels<UserModels>,
) {
  // add model only if needed.
  if (use.User) {
    loaded.User = database.model<UserDocument, AccessibleModel<UserDocument>>(
      UserModelEnum.USER,
      UserSchema,
    );
  }

  if (use.Profile) {
    loaded.Profile = database.model<
      ProfileDocument,
      AccessibleModel<ProfileDocument>
    >(UserModelEnum.PROFILE, createProfileModel(loaded.User));
  }

  if (use.Session) {
    loaded.Session = database.model<
      SessionDocument,
      AccessibleModel<SessionDocument>
    >(UserModelEnum.SESSION, createSessionModel(loaded.User));
  }

  if (use.UserGroup) {
    loaded.UserGroup = database.model<
      UserGroupDocument,
      AccessibleModel<UserGroupDocument>
    >(UserModelEnum.USERGROUP, createUserGroupModel(loaded.User));
  }
}
