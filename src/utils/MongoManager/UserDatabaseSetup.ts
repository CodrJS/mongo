import { createProfileModel } from "@/schemas/Profile";
import { createSessionModel } from "@/schemas/Session";
import UserSchema from "@/schemas/User";
import { createUserGroupModel } from "@/schemas/UserGroup";
import { UserModelEnum, UserModels } from "@/types";
import { AccessibleModel } from "@casl/mongoose";
import { IProfile, ISession, IUser, IUserGroup } from "@codrjs/models";
import mongoose from "mongoose";

export default function userDatabaseSetup(
  database: mongoose.Connection,
  use: Record<UserModels, boolean>,
  loaded: Record<UserModels, AccessibleModel<any>>,
) {
  // add model only if needed.
  if (use.User) {
    loaded.User = database.model<IUser, AccessibleModel<IUser>>(
      UserModelEnum.USER,
      UserSchema,
    );
  }

  if (use.Profile) {
    loaded.Profile = database.model<IProfile, AccessibleModel<IProfile>>(
      UserModelEnum.PROFILE,
      createProfileModel(loaded.User),
    );
  }

  if (use.Session) {
    loaded.Session = database.model<ISession, AccessibleModel<ISession>>(
      UserModelEnum.SESSION,
      createSessionModel(loaded.User),
    );
  }

  if (use.UserGroup) {
    loaded.UserGroup = database.model<
      IUserGroup,
      AccessibleModel<IUserGroup>
    >(UserModelEnum.USERGROUP, createUserGroupModel(loaded.User));
  }
}
