import mongoose, { Connection, Types } from "mongoose";
import Config from "@codrjs/config";
import {
  DatabaseCoreConfig,
  DatabaseEnum,
  DatabaseNotificationConfig,
  DatabaseProjectConfig,
  DatabaseUserConfig,
  UserModelEnum,
} from "@/types";
import { IProfile, ISession, IUser, IUserGroup } from "@codrjs/models";
import { AccessibleModel } from "@casl/mongoose";
import UserSchema, { UserDocument } from "@/schemas/User";
import { ProfileDocument, createProfileModel } from "@/schemas/Profile";
import { SessionDocument, createSessionModel } from "@/schemas/Session";
import { UserGroupDocument, createUserGroupModel } from "@/schemas/UserGroup";

type DatabaseConfig =
  | DatabaseCoreConfig
  | DatabaseNotificationConfig
  | DatabaseProjectConfig
  | DatabaseUserConfig;

export default class MongoManager {
  private _mongoose: Connection;
  private _coreDatabase?: Connection;
  private _notificationDatabase?: Connection;
  private _projectDatabase?: Connection;
  private _userDatabase?: Connection;

  private _loadedUserModels: {
    [UserModelEnum.PROFILE]?: AccessibleModel<ProfileDocument>;
    [UserModelEnum.SESSION]?: AccessibleModel<SessionDocument>;
    [UserModelEnum.USERGROUP]?: AccessibleModel<UserGroupDocument>;
    [UserModelEnum.USER]?: AccessibleModel<UserDocument>;
  } = {
    [UserModelEnum.PROFILE]: undefined,
    [UserModelEnum.SESSION]: undefined,
    [UserModelEnum.USERGROUP]: undefined,
    [UserModelEnum.USER]: undefined,
  };

  constructor() {
    this._mongoose = mongoose.createConnection(Config.mongo.uri);
  }

  connect(configs: Array<DatabaseConfig>) {
    for (const config of configs) {
      switch (config.name) {
        case DatabaseEnum.CORE:
          this._connectCoreDatabase();
          break;
        case DatabaseEnum.NOTIFICATION:
          this._connectNotificationDatabase();
          break;
        case DatabaseEnum.PROJECT:
          this._connectProjectDatabase();
          break;
        case DatabaseEnum.USER:
          this._connectUserDatabase();
      }
      break;
    }
  }

  private _connectCoreDatabase() {
    this._coreDatabase = this._mongoose.useDb(DatabaseEnum.CORE);

    // add model only if needed.
  }

  private _connectNotificationDatabase() {
    this._notificationDatabase = this._mongoose.useDb(
      DatabaseEnum.NOTIFICATION,
    );

    // add model only if needed.
  }

  private _connectProjectDatabase() {
    this._projectDatabase = this._mongoose.useDb(DatabaseEnum.PROJECT);

    // add model only if needed.
  }

  private _connectUserDatabase(models?: UserModelEnum[]) {
    this._userDatabase = this._mongoose.useDb(DatabaseEnum.USER);
    const use = {
      [UserModelEnum.PROFILE]: false,
      [UserModelEnum.SESSION]: false,
      [UserModelEnum.USER]: true,
      [UserModelEnum.USERGROUP]: false,
    };

    if (models) {
      for (const model of models) {
        use[model] = true;
      }
    }

    // add model only if needed.
    if (use.User) {
      this._loadedUserModels.User = this._userDatabase.model<
        IUser,
        AccessibleModel<UserDocument>
      >("User", UserSchema);
    }

    if (use.Profile) {
      if (use.User) {
        this._loadedUserModels.Profile = this._userDatabase.model<
          IProfile,
          AccessibleModel<ProfileDocument>
        >(
          "Profile",
          createProfileModel(this._loadedUserModels.User as AccessibleModel<UserDocument>),
        );
      } else {
        throw "Profile requires the User model to be loaded. Please add User to your database configuration.";
      }
    }

    if (use.Session) {
      if (use.User) {
        this._loadedUserModels.Session = this._userDatabase.model<
          ISession,
          AccessibleModel<SessionDocument>
        >(
          "Session",
          createSessionModel(this._loadedUserModels.User as AccessibleModel<UserDocument>),
        );
      } else {
        throw "Session requires the User model to be loaded. Please add User to your database configuration.";
      }
    }

    if (use.UserGroup) {
      if (use.User) {
        this._loadedUserModels.UserGroup = this._userDatabase.model<
          IUserGroup,
          AccessibleModel<UserGroupDocument>
        >(
          "UserGroup",
          createUserGroupModel(this._loadedUserModels.User as AccessibleModel<UserDocument>),
        );
      } else {
        throw "UserGroup requires the User model to be loaded. Please add User to your database configuration.";
      }
    }
  }

  get isConnected() {
    return this._mongoose.readyState === 1;
  }

  get User() {
    return this._loadedUserModels;
  }
}

const db = new MongoManager();
db.connect([
  {
    name: DatabaseEnum.USER,
    models: [UserModelEnum.PROFILE, UserModelEnum.USER],
  },
]);
db.User?.User?.findOne({ userId: new Types.ObjectId(0) }).populate("user");
