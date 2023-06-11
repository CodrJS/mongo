import mongoose, { Connection } from "mongoose";
import Config from "@codrjs/config";
import {
  DatabaseCoreConfig,
  DatabaseEnum,
  DatabaseNotificationConfig,
  DatabaseProjectConfig,
  DatabaseUserConfig,
  ILoadedUserModels,
  UserModelEnum,
} from "@/types";
import { AccessibleModel } from "@casl/mongoose";
import userDatabaseSetup from "./UserDatabaseSetup";

type UnravelArray<T> = T extends Array<infer U> ? U : T;

export default class MongoManager<
  C extends DatabaseCoreConfig | undefined,
  N extends DatabaseNotificationConfig | undefined,
  P extends DatabaseProjectConfig | undefined,
  U extends DatabaseUserConfig | undefined,
> {
  private _mongoose: Connection;
  private _coreDatabase?: Connection;
  private _notificationDatabase?: Connection;
  private _projectDatabase?: Connection;
  private _userDatabase?: Connection;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private _loadedUserModels!: ILoadedUserModels<
    U extends DatabaseUserConfig ? UnravelArray<U["models"]> : undefined
  > = {};

  constructor(configs: (C | N | P | U)[]) {
    this._mongoose = mongoose.createConnection(Config.mongo.uri);

    this.connect(configs);
  }

  connect(configs: (C | N | P | U)[]) {
    for (const config of configs) {
      if (config) {
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
            break;
        }
      }
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
    const use: Record<UserModelEnum, boolean> = {
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

    userDatabaseSetup(
      this._userDatabase,
      use,
      this._loadedUserModels as Record<
        UserModelEnum,
        AccessibleModel<unknown | undefined>
      >,
    );
  }

  get isConnected() {
    return this._mongoose.readyState === 1;
  }

  get User() {
    return this._loadedUserModels;
  }
}
