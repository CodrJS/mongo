import { EmailRegex, IUser, Types } from "@codrjs/models";
import { Schema } from "mongoose";
import {
  AccessibleFieldsModel,
  accessibleFieldsPlugin,
  accessibleRecordsPlugin,
} from "@casl/mongoose";

export type UserDocument = IUser & AccessibleFieldsModel<IUser>;
const UserSchema = new Schema<UserDocument>(
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
  },
  {
    timestamps: true,
  },
);

// exports User schema.
UserSchema.plugin(accessibleFieldsPlugin);
UserSchema.plugin(accessibleRecordsPlugin);
export default UserSchema;
