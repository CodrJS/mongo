import { EmailRegex, IUser, Types } from "@codrjs/models";
import { Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  accessibleFieldsPlugin,
  accessibleRecordsPlugin,
} from "@casl/mongoose";

export type UserDocument = IUser & AccessibleFieldsModel<IUser>;
const UserSchema = new Schema<IUser>(
  {
    type: {
      type: String,
      enum: Types.UserEnum,
      required: true,
      default: Types.UserEnum.ANONYMOUS,
    },
    email: {
      type: String,
      required: true,
      match: [EmailRegex, "is invalid."],
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: Types.UserRoleEnum,
      required: true,
      default: Types.UserRoleEnum.ANNOTATOR,
    },
    flags: {
      type: {
        isAnonymous: Boolean,
        isDisabled: Boolean,
        isDeleted: Boolean,
      },
      required: true,
      default: {
        isAnonymous: false,
        isDisabled: false,
        isDeleted: false,
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

// exports User schema.
UserSchema.plugin(accessibleFieldsPlugin);
UserSchema.plugin(accessibleRecordsPlugin);
export default UserSchema;
