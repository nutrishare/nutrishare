import Elysia, { t } from "elysia";
import { googleAuth } from "../lucia";
import { getSuccessCallbackUrl } from "./util";
import authService from "./auth.service";
import { schemaDetail } from "./auth.model";

export default new Elysia({ prefix: "/google" })
  .use(authService)
  .get(
    "/authorize",
    async ({ set, cookie: { googleAuthState } }) => {
      const [authUrl, authState] = await googleAuth.getAuthorizationUrl();
      // FIXME: Set secure=true when we have HTTPS (maybe with env=PRODUCTION set?)
      googleAuthState.value = authState;
      googleAuthState.maxAge = 60;
      set.redirect = authUrl.toString();
    },
    {
      cookie: t.Cookie({
        googleAuthState: t.String(),
      }),
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
      authService,
    }) => {
      // TODO: Instead of throwing an error here,
      // we should redirect the user to an error callback on the frontend.
      // This could be customizable with a param to `/authorize`
      // and fall back to the current behavior if not provided.
      authService.validateOauthState(state, googleAuthState?.toString());
      const user = await authService.authenticateGoogleUser(code);
      const { accessToken, refreshToken } = await authService.signTokenPair(
        user,
      );
      set.redirect = getSuccessCallbackUrl(accessToken, refreshToken);
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
            description: `Redirect to ${getSuccessCallbackUrl(
              "accessToken",
              "refreshToken",
            )}`,
          },
        },
      },
    },
  );
