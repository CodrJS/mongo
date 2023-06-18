import { Types, ISession, Session } from "@codrjs/models";

const permissions: Types.Permissions<ISession, typeof Session> = {
  "codr:system": (_user, { can }) => {
    can("manage", "Session");
  },
  "codr:admin": (_user, { can }) => {
    can("manage", "Session");
  },
  "codr:researcher": (user, { can }) => {
    // can create, read, and update all sessions user owns
    can("edit", "Session", { userId: user._id });
  },
  "codr:annotator": (user, { can }) => {
    // can create, read, and update all sessions user owns
    can("edit", "Session", { userId: user._id });
  },
};

const SessionAbility = (user: Types.JwtPayload) =>
  Types.DefineAbility(user, permissions);
export default SessionAbility;
