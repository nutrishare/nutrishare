import Elysia, { t } from "elysia";
import { googleAuth } from "../lucia";
import cookie from "@elysiajs/cookie";
import { jwt } from "../plugins";
import { UnauthorizedError } from "../errors";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { randomUUID as uuidv4 } from "crypto";
import { getSuccessCallbackUrl } from "./util";

const schemaDetail = {
  tags: ["Auth"],
};

export default new Elysia({ prefix: "/google" })
  .use(cookie())
  .use(jwt)
  .error({
    UnauthorizedError,
  })
  .get(
    "/authorize",
    async ({ set, setCookie }) => {
      const [authUrl, authState] = await googleAuth.getAuthorizationUrl();
      setCookie("googleAuthState", authState, { maxAge: 60 });
      set.redirect = authUrl.toString();
    },
    {
      detail: {
        ...schemaDetail,
        responses: {
          302: {
            description: "Redirect to Google authorization page",
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
      cookie: { googleAuthState },
      jwt,
    }) => {
      // TODO: Instead of throwing an error here,
      // we should redirect the user to an error callback on the frontend.
      // This could be customizable with a param to `/authorize`
      // and fall back to the current behavior if not provided.
      if (!googleAuthState) {
        throw new UnauthorizedError(`Missing cookie 'googleAuthState'`);
      }
      if (googleAuthState.toString() !== state) {
        throw new UnauthorizedError(
          "The 'state' query param doesn't match the 'googleAuthState' cookie",
        );
      }

      try {
        const { getExistingUser, googleUser, createUser } =
          await googleAuth.validateCallback(code);

        const getUser = async () => {
          const existingUser = await getExistingUser();
          if (existingUser) return existingUser;

          return createUser({
            userId: uuidv4(),
            attributes: {
              username: googleUser.name,
              email: googleUser.email,
            },
          });
        };

        const user = await getUser();
        const accessToken = await jwt.sign({
          id: user.userId,
          sub: user.username,
        });
        set.redirect = getSuccessCallbackUrl(accessToken);
      } catch (e) {
        if (e instanceof OAuthRequestError) {
          throw new UnauthorizedError("Authentication with Google failed");
        }
        throw e;
      }
    },
    {
      query: t.Object({
        code: t.String(),
        state: t.String(),
        scope: t.String(),
        authuser: t.String(),
        prompt: t.String(),
      }),
      cookie: t.Cookie({
        googleAuthState: t.String(),
      }),
      detail: {
        ...schemaDetail,
        responses: {
          302: {
            description: `Redirect to ${getSuccessCallbackUrl("accessToken")}`,
          },
        },
      },
    },
  );
