import { IProfile, Profile, Types } from "@codrjs/models";

const permissions: Types.Permissions<IProfile, typeof Profile> = {
  "codr:system": (_user, { can, cannot }) => {
    can("manage", "Profile");
    cannot("manipulate", "Profile", { username: { $eq: "System" } });
  },
  "codr:admin": (_user, { can, cannot }) => {
    can("manage", "Profile");
    cannot("manipulate", "Profile", { username: { $eq: "System" } });
  },
  "codr:researcher": (user, { can }) => {
    // can read all profiles and update it's own
    can("read", "Profile");
    can("update", "Profile", { userId: user._id });
  },
  "codr:annotator": (_user, { can }) => {
    // can only read profiles
    can("read", "Profile");
  },
};

const ProfileAbility = (user: Types.JwtPayload) =>
  Types.DefineAbility(user, permissions);

export default ProfileAbility;
