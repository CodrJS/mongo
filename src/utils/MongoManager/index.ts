import mongoose, { Connection } from "mongoose";
import Config from "@codrjs/config";
import {
  CoreModelEnum,
  DatabaseCoreConfig,
  DatabaseEnum,
  DatabaseNotificationConfig,
  DatabaseProjectConfig,
  DatabaseUserConfig,
  ILoadedUserModels,
  NotificationModelEnum,
  ProjectModelEnum,
  UserModelEnum,
  UserModels,
} from "@/types";
import { AccessibleModel } from "@casl/mongoose";
import userDatabaseSetup from "./UserDatabaseSetup";

type UnionType<T extends string[]> = T extends Array<infer U> ? U : T;

const DatabaseConnectionConfig = Object.freeze({
  useCache: true,
  noListener: true,
});

export default class MongoManager<
  C extends DatabaseCoreConfig,
  N extends DatabaseNotificationConfig,
  P extends DatabaseProjectConfig,
  U extends DatabaseUserConfig,
> {
  private _mongoose: Connection;
  private _coreDatabase?: Connection;
  private _notificationDatabase?: Connection;
  private _projectDatabase?: Connection;
  private _userDatabase?: Connection;

  private _loadedUserModels: ILoadedUserModels<UnionType<U["models"]>>;

  constructor(configs: (C | N | P | U)[]) {
    this._mongoose = mongoose.createConnection(Config.mongo.uri);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._loadedUserModels = {};

    for (const config of configs) {
      if (config) {
        switch (config.name) {
          case DatabaseEnum.CORE:
            this._connectCoreDatabase(config.models);
            break;
          case DatabaseEnum.NOTIFICATION:
            this._connectNotificationDatabase(config.models);
            break;
          case DatabaseEnum.PROJECT:
            this._connectProjectDatabase(config.models);
            break;
          case DatabaseEnum.USER:
            this._connectUserDatabase(config.models);
            break;
        }
      }
    }

    if (typeof this._userDatabase === "undefined") {
      this._connectUserDatabase([UserModelEnum.USER]);
    }
  }

  private _connectCoreDatabase(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _models: CoreModelEnum[],
  ) {
    this._coreDatabase = this._mongoose.useDb(
      DatabaseEnum.CORE,
      DatabaseConnectionConfig,
    );

    // add model only if needed.
  }

  private _connectNotificationDatabase(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _models: NotificationModelEnum[],
  ) {
    this._notificationDatabase = this._mongoose.useDb(
      DatabaseEnum.NOTIFICATION,
      DatabaseConnectionConfig,
    );

    // add model only if needed.
  }

  private _connectProjectDatabase(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _models: ProjectModelEnum[],
  ) {
    this._projectDatabase = this._mongoose.useDb(
      DatabaseEnum.PROJECT,
      DatabaseConnectionConfig,
    );

    // add model only if needed.
  }

  private _connectUserDatabase(models: UserModels[]) {
    this._userDatabase = this._mongoose.useDb(
      DatabaseEnum.USER,
      DatabaseConnectionConfig,
    );
    const use: Record<UserModels, boolean> = {
      [UserModelEnum.PROFILE]: false,
      [UserModelEnum.SESSION]: false,
      [UserModelEnum.USER]: true,
      [UserModelEnum.USERGROUP]: false,
    };

    for (const model of models) {
      use[model] = true;
    }

    userDatabaseSetup(
      this._userDatabase,
      use,
      this._loadedUserModels as Record<UserModels, AccessibleModel<any>>,
    );
  }

  get isConnected() {
    return this._mongoose.readyState === 1;
  }

  get User() {
    return this._loadedUserModels;
  }
}
