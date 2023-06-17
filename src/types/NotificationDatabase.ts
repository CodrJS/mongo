import { DatabaseEnum } from "./Database";

export enum NotificationModelEnum {
  MESSAGE = "Message",
}
export type NotificationModelType = keyof typeof NotificationModelEnum;
export type NotificationModels = `${NotificationModelEnum}`;

export interface DatabaseNotificationConfig {
  name: DatabaseEnum.NOTIFICATION;
  models: NotificationModelEnum[];
}
