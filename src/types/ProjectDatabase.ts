import { DatabaseEnum } from "./Database";

export type ProjectModelType = "ANNOTATION" | "DATASET" | "PROJECT" | "SAMPLE";
export enum ProjectModelEnum {
  ANNOTATION = "Annotation",
  DATASET = "Dataset",
  PROJECT = "Project",
  SAMPLE = "Sample",
}

export interface DatabaseProjectConfig {
  name: DatabaseEnum.PROJECT;
  models?: ProjectModelEnum[];
}
