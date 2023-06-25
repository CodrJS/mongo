import { ISession } from "@codrjs/models";
import { Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  AccessibleModel,
  accessibleFieldsPlugin,
  accessibleRecordsPlugin,
} from "@casl/mongoose";
import { UserDocument } from "./User";

export type SessionDocument = ISession & AccessibleFieldsModel<ISession>;

export function createSessionModel(userModel: AccessibleModel<UserDocument>) {
  const SessionSchema = new Schema<ISession>(
    {
      status: {
        type: String,
        enum: ["INITIATING", "ESTABLISHED", "CLOSED"],
        required: true,
        default: "INITIATING",
      },
      userId: {
        type: SchemaTypes.ObjectId,
        required: true,
        unique: false,
        index: true,
        ref: "User",
      },
      os: { type: String },
      browser: { type: String },
      ipAddress: { type: String },
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

  SessionSchema.virtual("user", {
    ref: userModel,
    localField: "userId",
    foreignField: "_id",
  });

  // exports Session model.
  SessionSchema.plugin(accessibleFieldsPlugin);
  SessionSchema.plugin(accessibleRecordsPlugin);

  return SessionSchema;
}
