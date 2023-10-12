import { Elysia, t } from "elysia";
import { jwt } from "../plugins";
import { githubAuth } from "../lucia";
import { randomUUID as uuidv4 } from "crypto";
import cookie from "@elysiajs/cookie";
import { UnauthorizedError } from "../errors";
import { OAuthRequestError } from "@lucia-auth/oauth";

const schemaDetail = {
  tags: ["Auth"],
};

export default new Elysia({ prefix: "/github" })
  .use(cookie())
  .use(jwt)
  .error({
    UnauthorizedError,
  })
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
      // TODO: Instead of throwing an error here,
      // we should redirect the user to an error callback on the frontend.
      // This could be customizable with a param to `/authorize`
      // and fall back to the current behavior if not provided.
      if (!githubAuthState) {
        throw new UnauthorizedError(`Missing cookie 'githubAuthState'`);
      }
      if (githubAuthState.toString() !== state) {
        throw new UnauthorizedError(
          "The 'state' query param doesn't match the 'githubAuthState' cookie",
        );
      }

      try {
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
      } catch (e) {
        if (e instanceof OAuthRequestError) {
          throw new UnauthorizedError("Invalid GitHub authorization code");
        }
      }
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
