import { IProfile, IUser } from "@codrjs/models";
import { Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  AccessibleModel,
  accessibleFieldsPlugin,
  accessibleRecordsPlugin,
} from "@casl/mongoose";

export type ProfileDocument = IProfile & AccessibleFieldsModel<IProfile>;

export function createProfileModel(userModel: AccessibleModel<IUser>) {
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
