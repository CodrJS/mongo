export enum DatabaseEnum {
  CORE = "Core",
  NOTIFICATION = "Notification",
  PROJECT = "Project",
  USER = "User",
}
export type DatabaseType = keyof typeof DatabaseEnum;
export type Databases = `${DatabaseEnum}`;
