import Elysia from "elysia";
import { randomUUID as uuidv4 } from "crypto";
import { LuciaError } from "lucia";
import { PrismaClientError, prisma } from "@nutrishare/db";
import { jwt } from "../plugins";
import { BadRequestError, ConflictError, UnauthorizedError } from "../errors";
import { auth as localAuth, githubAuth, googleAuth } from "../lucia";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { TokenType } from "../plugins/jwt.plugin";

export default new Elysia()
  .use(jwt)
  .error({
    BadRequestError,
    ConflictError,
    UnauthorizedError,
  })
  .derive(async ({ accessJwt, refreshJwt }) => ({
    authService: {
      signTokenPair: async (user: { userId: string; username: string }) => {
        // TODO: Access token should live much shorter than refresh token
        const accessToken = await accessJwt.sign({
          id: user.userId,
          sub: user.username,
          typ: TokenType.Access,
        });
        const refreshToken = await refreshJwt.sign({
          id: user.userId,
          sub: user.username,
          typ: TokenType.Refresh,
        });
        // Invalidate all valid refresh tokens for this user
        await prisma.refreshToken.updateMany({
          where: { user: { id: user.userId }, expired: false },
          data: { expired: true },
        });
        await prisma.refreshToken.create({
          data: {
            user: { connect: { id: user.userId } },
            refreshToken: refreshToken,
            expired: false,
          },
        });
        return { accessToken, refreshToken };
      },
      verifyAccessToken: async (token: string) => {
        const jwtPayload = await accessJwt.verify(token);
        if (!jwtPayload || jwtPayload.typ !== TokenType.Access) {
          throw new UnauthorizedError();
        }
        return jwtPayload;
      },
      verifyRefreshToken: async (token: string) => {
        const jwtPayload = await refreshJwt.verify(token);
        if (!jwtPayload || jwtPayload.typ !== TokenType.Refresh) {
          throw new UnauthorizedError();
        }
        return jwtPayload;
      },
      validateUsername: (username: string) => {
        if (username.length < 3 || username.length > 20) {
          throw new BadRequestError(
            "Username must be between 3 and 20 characters long",
          );
        }
      },
      validatePassword: (password: string) => {
        if (password.length < 8 || password.length > 128) {
          throw new BadRequestError(
            "Password must be between 8 and 128 characters long",
          );
        }
      },
      createLocalUser: async (
        username: string,
        email: string,
        password: string,
      ) => {
        const userId = uuidv4();
        try {
          await localAuth.createUser({
            userId,
            key: {
              providerId: "local",
              providerUserId: username.toLowerCase(),
              password,
            },
            attributes: {
              username,
              email,
            },
          });
          // NOTE: We create an additional key so the user can use their email to log in
          localAuth.createKey({
            userId: userId,
            providerId: "local",
            providerUserId: email.toLowerCase(),
            password,
          });
          return await localAuth.getUser(userId);
        } catch (e) {
          if (e instanceof PrismaClientError) {
            // Unique constraint violation
            if (e.code === "P2002") {
              throw new ConflictError("Username or email already exists");
            }
          }
          throw e;
        }
      },
      authenticateLocalUser: async (login: string, password: string) => {
        try {
          const key = await localAuth.useKey(
            "local",
            login.toLowerCase(),
            password,
          );
          return await localAuth.getUser(key.userId);
        } catch (e) {
          if (e instanceof LuciaError) {
            if (
              e.message === "AUTH_INVALID_KEY_ID" ||
              e.message === "AUTH_INVALID_PASSWORD"
            ) {
              throw new UnauthorizedError("Invalid login or password");
            }
          }
          throw e;
        }
      },
      validateOauthState: (state: string, cookieState: string) => {
        if (cookieState !== state) {
          throw new UnauthorizedError("Invalid OAuth state");
        }
      },
      authenticateGithubUser: async (code: string) => {
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
                email: githubUser.email,
              },
            });
          };

          return await getUser();
        } catch (e) {
          if (e instanceof OAuthRequestError) {
            throw new UnauthorizedError("Authentication with GitHub failed");
          }
          throw e;
        }
      },
      authenticateGoogleUser: async (code: string) => {
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

          return await getUser();
        } catch (e) {
          if (e instanceof OAuthRequestError) {
            throw new UnauthorizedError("Authentication with Google failed");
          }
          throw e;
        }
      },
    },
  }));
