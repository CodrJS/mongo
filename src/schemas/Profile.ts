import { IProfile } from "@codrjs/models";
import { Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  AccessibleModel,
  accessibleFieldsPlugin,
  accessibleRecordsPlugin,
} from "@casl/mongoose";
import { UserDocument } from "./User";

export type ProfileDocument = IProfile & AccessibleFieldsModel<IProfile>;

export function createProfileModel(userModel?: AccessibleModel<UserDocument>) {
  if (userModel) {
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

    ProfileSchema.plugin(accessibleFieldsPlugin);
    ProfileSchema.plugin(accessibleRecordsPlugin);

    return ProfileSchema;
  } else {
    throw "User model is not defined.";
  }
}
