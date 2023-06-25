import { IProfile, Profile, Types } from "@codrjs/models";
import { ObjectId } from "@/utils";

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
    can("update", "Profile", { userId: new ObjectId(user.sub) });
  },
  "codr:annotator": (user, { can }) => {
    // can read profiles
    can("read", "Profile");

    // if user is is not anonymous,
    // then they can update their profile.
    if (!user.flags.isAnonymous) {
      can("update", "Profile", { userId: new ObjectId(user.sub) });
    }
  },
};

const ProfileAbility = (user: Types.JwtPayload) =>
  Types.DefineAbility(user, permissions);

export default ProfileAbility;
