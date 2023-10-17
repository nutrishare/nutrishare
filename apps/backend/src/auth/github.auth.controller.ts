import { Elysia, t } from "elysia";
import { githubAuth } from "../lucia";
import cookie from "@elysiajs/cookie";
import { getSuccessCallbackUrl } from "./util";
import authService from "./auth.service";
import { schemaDetail } from "./auth.model";

export default new Elysia({ prefix: "/github" })
  .use(cookie())
  .use(authService)
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
      authService,
    }) => {
      // TODO: Instead of throwing an error here,
      // we should redirect the user to an error callback on the frontend.
      // This could be customizable with a param to `/authorize`
      // and fall back to the current behavior if not provided.
      authService.validateOauthState(state, githubAuthState?.toString());
      const user = await authService.authenticateGithubUser(code);
      const accessToken = await authService.signToken(user);
      set.redirect = getSuccessCallbackUrl(accessToken);
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
            description: `Redirect to ${getSuccessCallbackUrl("accessToken")}`,
          },
        },
      },
    },
  );
