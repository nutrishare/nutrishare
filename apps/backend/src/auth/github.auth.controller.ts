import { Elysia, t } from "elysia";
import { githubAuth } from "../lucia";
import cookie from "@elysiajs/cookie";
import { randomUUID as uuidv4 } from "crypto";

export default new Elysia()
  .use(cookie())
  .get(
    "/login/github",
    async ({ set, setCookie }) => {
      const [authUrl, authState] = await githubAuth.getAuthorizationUrl();

      setCookie("githubOauthState", authState, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60,
      });
      set.redirect = authUrl.toString();
    },
    {
      cookie: t.Cookie({
        githubOauthState: t.String(),
      }),
    },
  )
  .get(
    "/login/github/callback",
    async ({ query: { code, state }, set, cookie: { githubOauthState } }) => {
      if (githubOauthState.toString() !== state) {
        set.status = 400;
        throw new Error("Invalid value of the `githubOauthState` cookie");
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

      return await getUser();
    },
    {
      query: t.Object({
        code: t.String(),
        state: t.String(),
      }),
      cookie: t.Cookie({
        githubOauthState: t.String(),
      }),
    },
  );
