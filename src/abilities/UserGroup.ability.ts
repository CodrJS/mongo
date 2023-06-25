import { Types, IUserGroup, UserGroup } from "@codrjs/models";
import { ObjectId } from "@/utils";

const permissions: Types.Permissions<IUserGroup, typeof UserGroup> = {
  "codr:system": (_user, { can }) => {
    can("manage", "UserGroup");
  },
  "codr:admin": (_user, { can }) => {
    can("manage", "UserGroup");
  },
  "codr:researcher": (user, { can }) => {
    // can only update and delete it's own UserGroup
    can("read", "UserGroup", { "flags.isPrivate": false });
    can("read", "UserGroup", { createdBy: new ObjectId(user.sub) });
    can("create", "UserGroup");
    can("update", "UserGroup", {
      createdBy: new ObjectId(user.sub),
    });
    can("delete", "UserGroup", {
      createdBy: new ObjectId(user.sub),
    });
  },
  "codr:annotator": (_user, { can }) => {
    // can only read UserGroups
    can("read", "UserGroup");
  },
};

const UserGroupAbility = (user: Types.JwtPayload) =>
  Types.DefineAbility(user, permissions);
export default UserGroupAbility;
