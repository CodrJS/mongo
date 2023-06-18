import { IUser, Types, User } from "@codrjs/models";
import { Types as MongoTypes } from "mongoose";

const permissions: Types.Permissions<IUser, typeof User> = {
  /**
   * @TODO find a way to disallow system from creating system users.
   */
  "codr:system": (_user, { can, cannot }) => {
    can("manage", "User");
    cannot("manipulate", "User", { type: { $eq: Types.UserEnum.SYSTEM } });
    cannot("manipulate", "User", { role: { $eq: Types.UserRoleEnum.SYSTEM } });
  },
  /**
   * @TODO find a way to disallow admin from creating system users.
   */
  "codr:admin": (_user, { can, cannot }) => {
    can("manage", "User");
    cannot("manipulate", "User", { type: { $eq: Types.UserEnum.SYSTEM } });
    cannot("manipulate", "User", { role: { $eq: Types.UserRoleEnum.SYSTEM } });
  },
  "codr:researcher": (user, { can }) => {
    // can only read it's own user
    can("read", "User", { _id: new MongoTypes.ObjectId(user.sub) });
  },
  "codr:annotator": (user, { can }) => {
    // can only read it's own user
    can("read", "User", { _id: new MongoTypes.ObjectId(user.sub) });
  },
};

const UserAbility = (user: Types.JwtPayload) =>
  Types.DefineAbility(user, permissions);
export default UserAbility;
