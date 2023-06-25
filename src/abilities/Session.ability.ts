import { Types, ISession, Session } from "@codrjs/models";
import { ObjectId } from "@/utils";

const permissions: Types.Permissions<ISession, typeof Session> = {
  "codr:system": (_user, { can }) => {
    can("manage", "Session");
  },
  "codr:admin": (_user, { can }) => {
    can("manage", "Session");
  },
  "codr:researcher": (user, { can }) => {
    // can create, read, and update all sessions user owns
    can("create", "Session");
    can("edit", "Session", { userId: new ObjectId(user.sub) });
  },
  "codr:annotator": (user, { can }) => {
    // can create, read, and update all sessions user owns
    can("create", "Session");
    can("edit", "Session", { userId: new ObjectId(user.sub) });
  },
};

const SessionAbility = (user: Types.JwtPayload) =>
  Types.DefineAbility(user, permissions);
export default SessionAbility;
