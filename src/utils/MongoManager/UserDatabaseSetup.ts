import {
  ProfileDocument,
  SessionDocument,
  UserDocument,
} from "@/schemas/Documents";
import { createProfileModel } from "@/schemas/Profile";
import { createSessionModel } from "@/schemas/Session";
import UserSchema from "@/schemas/User";
import { UserGroupDocument, createUserGroupModel } from "@/schemas/UserGroup";
import { UserModelEnum } from "@/types";
import { AccessibleModel } from "@casl/mongoose";
import { IProfile, ISession, IUser, IUserGroup } from "@codrjs/models";
import mongoose from "mongoose";

export default function userDatabaseSetup(
  database: mongoose.Connection,
  use: Record<UserModelEnum, boolean>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loaded: Record<UserModelEnum, AccessibleModel<any | undefined>>,
) {
  // add model only if needed.
  if (use.User) {
    loaded.User = database.model<IUser, AccessibleModel<UserDocument>>(
      "User",
      UserSchema,
    );
  }

  if (use.Profile) {
    if (use.User) {
      loaded.Profile = database.model<
        IProfile,
        AccessibleModel<ProfileDocument>
      >("Profile", createProfileModel(loaded.User));
    } else {
      throw "Profile requires the User model to be loaded. Please add User to your database configuration.";
    }
  }

  if (use.Session) {
    if (use.User) {
      loaded.Session = database.model<
        ISession,
        AccessibleModel<SessionDocument>
      >("Session", createSessionModel(loaded.User));
    } else {
      throw "Session requires the User model to be loaded. Please add User to your database configuration.";
    }
  }

  if (use.UserGroup) {
    if (use.User) {
      loaded.UserGroup = database.model<
        IUserGroup,
        AccessibleModel<UserGroupDocument>
      >("UserGroup", createUserGroupModel(loaded.User));
    } else {
      throw "UserGroup requires the User model to be loaded. Please add User to your database configuration.";
    }
  }
}
