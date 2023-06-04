import { Types, IUserGroup } from "@codrjs/models";

const permissions: Types.Permissions<IUserGroup> = {
  "codr:system": (_user, { can }) => {
    can("manage", "UserGroup");
  },
  "codr:admin": (_user, { can }) => {
    can("manage", "UserGroup");
  },
  "codr:researcher": (user, { can }) => {
    // can only update and delete it's own UserGroup
    can("read", "UserGroup");
    can("create", "UserGroup");
    can("update", "UserGroup", { createdBy: user._id });
    can("delete", "UserGroup", { createdBy: user._id });
  },
  "codr:annotator": (_user, { can }) => {
    // can only read UserGroups
    can("read", "UserGroup");
  },
};

const UserGroupAbility = (user: Types.JwtPayload) => Types.DefineAbility(user, permissions);
export default UserGroupAbility;
