import { DatabaseEnum } from "./Database";

export enum ProjectModelEnum {
  ANNOTATION = "Annotation",
  DATASET = "Dataset",
  PROJECT = "Project",
  SAMPLE = "Sample",
}
export type ProjectModelType = keyof typeof ProjectModelEnum;
export type ProjectModels = `${ProjectModelEnum}`;

export interface DatabaseProjectConfig {
  name: DatabaseEnum.PROJECT;
  models: ProjectModelEnum[];
}
