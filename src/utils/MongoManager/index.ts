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
  MongooseConnectionEvent,
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
  private _config: (C | N | P | U)[];
  private _mongoose!: Connection;
  private _coreDatabase?: Connection;
  private _notificationDatabase?: Connection;
  private _projectDatabase?: Connection;
  private _userDatabase?: Connection;

  private _loadedUserModels: ILoadedUserModels<UnionType<U["models"]>>;

  constructor(configs: (C | N | P | U)[]) {
    this._config = configs;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._loadedUserModels = {};
  }

  connect(hook?: (connection: Connection) => void) {
    this._mongoose = mongoose.createConnection(Config.mongo.uri);

    // used to hook in event listeners.
    if (typeof hook === "function") {
      hook(this._mongoose);
    }

    for (const config of this._config) {
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

    return this._mongoose.asPromise();
  }

  close() {
    return this._mongoose.close();
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
    return {
      ...this._loadedUserModels,
      on: (event: MongooseConnectionEvent, listener: () => void) => {
        this._on({ connection: this._userDatabase, event, listener });
      },
      connection: this._userDatabase as U extends DatabaseUserConfig
        ? Connection
        : never,
    };
  }

  private _on({
    connection,
    event,
    listener,
  }: {
    connection?: Connection;
    event: MongooseConnectionEvent;
    listener: () => void;
  }) {
    if (connection) {
      connection.on(event, listener);
    } else {
      throw "No mongoose connection was found.";
    }
  }

  get connection() {
    return this._mongoose;
  }
}
