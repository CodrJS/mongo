import { DatabaseEnum } from "./Database";

export type NotificationModelType = "MESSAGE";
export enum NotificationModelEnum {
  MESSAGE = "Message",
}

export interface DatabaseNotificationConfig {
  name: DatabaseEnum.NOTIFICATION;
  models?: NotificationModelEnum[];
}
