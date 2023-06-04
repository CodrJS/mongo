import { UserRoleEnum } from "@/../../models/dist/types/types";
import { IUser, Types } from "@codrjs/models";

const permissions: Types.Permissions<IUser> = {
  /**
   * @TODO find a way to disallow system from creating system users.
   */
  "codr:system": (_user, { can, cannot }) => {
    can("manage", "User");
    cannot("update", "User", { role: { $eq: UserRoleEnum.SYSTEM } });
    cannot("delete", "User", { role: { $eq: UserRoleEnum.SYSTEM } });
  },
  /**
   * @TODO find a way to disallow admin from creating system users.
   */
  "codr:admin": (_user, { can, cannot }) => {
    can("manage", "User");
    cannot("update", "User", { role: { $eq: UserRoleEnum.SYSTEM } });
    cannot("delete", "User", { role: { $eq: UserRoleEnum.SYSTEM } });
  },
  "codr:researcher": (user, { can }) => {
    // can only read it's own user
    can("read", "User", { _id: user._id });
  },
  "codr:annotator": (user, { can }) => {
    // can only read it's own user
    can("read", "User", { _id: user._id });
  },
};

const UserAbility = (user: Types.JwtPayload) =>
  Types.DefineAbility(user, permissions);
export default UserAbility;
