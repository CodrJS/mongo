import { IUser, IUserGroup } from "@codrjs/models";
import { Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  AccessibleModel,
  accessibleFieldsPlugin,
  accessibleRecordsPlugin,
} from "@casl/mongoose";

export type UserGroupDocument = IUserGroup & AccessibleFieldsModel<IUserGroup>;

export function createUserGroupModel(userModel: AccessibleModel<IUser>) {
  const UserGroupSchema = new Schema<UserGroupDocument>(
    {
      createdBy: {
        required: true,
        index: true,
        type: SchemaTypes.ObjectId,
        ref: "User",
      },
      members: {
        items: {
          type: SchemaTypes.ObjectId,
          ref: "User",
        },
      },
      teams: {
        items: {
          type: SchemaTypes.ObjectId,
          ref: "UserGroup",
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
      createdAt: { type: String },
      updatedAt: { type: String },
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
