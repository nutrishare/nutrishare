import { Elysia, t } from "elysia";
import { jwt } from "../plugins";
import { githubAuth } from "../lucia";
import { randomUUID as uuidv4 } from "crypto";
import cookie from "@elysiajs/cookie";
import { UnauthorizedError } from "../errors";

const schemaDetail = {
  tags: ["Auth"],
};

export default new Elysia({ prefix: "/github" })
  .use(cookie())
  .use(jwt)
  .get(
    "/authorize",
    async ({ set, setCookie }) => {
      const [authUrl, authState] = await githubAuth.getAuthorizationUrl();
      // FIXME: Set secure=true when we have HTTPS (maybe with env=PRODUCTION set?)
      setCookie("githubAuthState", authState, { maxAge: 60 });
      set.redirect = authUrl.toString();
    },
    {
      detail: {
        ...schemaDetail,
        responses: {
          302: {
            description: "Redirect to GitHub authorization page",
          },
        },
      },
    },
  )
  .get(
    "/callback",
    async ({
      set,
      query: { code, state },
      cookie: { githubAuthState },
      jwt,
    }) => {
      // NOTE: Maybe instead of throwing an error here,
      // we should redirect the user to an error callback on the frontend?
      // This could be customizable with a param to `/authorize`
      // and fall back to the current behavior if not provided.
      if (!githubAuthState) {
        set.status = "Unauthorized";
        // FIXME: Don't throw raw errors
        throw new Error("Missing `githubAuthState` cookie");
      }
      if (githubAuthState.toString() !== state) {
        set.status = "Unauthorized";
        // FIXME: Don't throw raw errors
        throw new Error("Invalid value of the `githubAuthState` cookie");
      }

      const { getExistingUser, githubUser, createUser } =
        await githubAuth.validateCallback(code);

      const getUser = async () => {
        const existingUser = await getExistingUser();
        if (existingUser) return existingUser;

        return createUser({
          userId: uuidv4(),
          attributes: {
            username: githubUser.login,
          },
        });
      };

      const user = await getUser();
      const accessToken = await jwt.sign({
        id: user.userId,
        sub: user.username,
      });
      // TODO: Frontend address should be configurable via a query param to `/authorize`
      set.redirect = `http://localhost:3000/auth/callback?token=${accessToken}`;
    },
    {
      query: t.Object({
        code: t.String(),
        state: t.String(),
      }),
      cookie: t.Cookie({
        githubAuthState: t.String(),
      }),
      detail: {
        ...schemaDetail,
        responses: {
          302: {
            description:
              "Redirect to http://localhost:3000/auth/callback?token=accessToken",
          },
        },
      },
    },
  );
