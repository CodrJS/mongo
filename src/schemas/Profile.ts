import { IProfile } from "@codrjs/models";
import { Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  AccessibleModel,
  accessibleFieldsPlugin,
  accessibleRecordsPlugin,
} from "@casl/mongoose";
import { UserDocument } from "./User";

export type ProfileDocument = IProfile & AccessibleFieldsModel<IProfile, object, object, { user: UserDocument }>;

export function createProfileModel(userModel: AccessibleModel<UserDocument>) {
  const ProfileSchema = new Schema<IProfile>(
    {
      avatarUrl: String,
      userId: {
        type: SchemaTypes.ObjectId,
        required: true,
        unique: true,
        index: true,
        ref: "User",
      },
      username: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
      name: {
        type: {
          first: String,
          last: String,
          preferred: String,
        },
        required: true,
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

  ProfileSchema.virtual("user", {
    ref: userModel,
    localField: "userId",
    foreignField: "_id",
  });

  // exports Profile model.
  ProfileSchema.plugin(accessibleFieldsPlugin);
  ProfileSchema.plugin(accessibleRecordsPlugin);

  return ProfileSchema;
}
