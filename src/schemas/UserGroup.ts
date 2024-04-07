import { IUserGroup } from "@codrjs/models";
import { Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  AccessibleModel,
  accessibleFieldsPlugin,
  accessibleRecordsPlugin,
} from "@casl/mongoose";
import { UserDocument } from "./User";

export type UserGroupDocument = IUserGroup & AccessibleFieldsModel<IUserGroup>;

export function createUserGroupModel(userModel: AccessibleModel<UserDocument>) {
  const UserGroupSchema = new Schema<UserGroupDocument>(
    {
      members: {
        items: {
          type: SchemaTypes.ObjectId,
          ref: "User",
        },
      },
      name: {
        type: "String",
        required: true,
        index: true,
        default: "Unnamed Group",
      },
      flags: {
        type: {
          isAnonymous: Boolean,
          isDeleted: Boolean,
          isJoinable: Boolean,
          isPrivate: Boolean,
        },
        required: true,
        default: {
          isAnonymous: false,
          isDeleted: false,
          isJoinable: false,
          isPrivate: false,
        },
      },
      createdAt: { type: Date },
      updatedAt: { type: Date },
      createdBy: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "User",
      },
      updatedBy: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: "User",
      },
    },
    {
      timestamps: true,
    },
  );

  UserGroupSchema.virtual("user", {
    ref: userModel,
    localField: "userId",
    foreignField: "_id",
  });

  // exports UserGroup model.
  UserGroupSchema.plugin(accessibleFieldsPlugin);
  UserGroupSchema.plugin(accessibleRecordsPlugin);

  return UserGroupSchema;
}
