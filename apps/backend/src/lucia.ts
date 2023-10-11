import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma";
import { lucia } from "lucia";
import { elysia } from "lucia/middleware";
import { prisma } from "@nutrishare/db";
import { github, google } from "@lucia-auth/oauth/providers";
import appEnv from "./env";
import { hashPassword, verifyPassword } from "./auth/util";

type UserAttributes = {
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
};

export const auth = lucia({
  env: "DEV", // TODO: Allow "PROD"
  middleware: elysia(),
  adapter: prismaAdapter(prisma, {
    user: "user",
    key: "authKey",
    session: null,
  }),
  getUserAttributes: (data): UserAttributes => ({
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    username: data.username,
    email: data.email,
  }),
  passwordHash: {
    generate: hashPassword,
    validate: verifyPassword,
  },
});

export const githubAuth = github(auth, {
  clientId: appEnv.GITHUB_CLIENT_ID,
  clientSecret: appEnv.GITHUB_CLIENT_SECRET,
});

export const googleAuth = google(auth, {
  clientId: appEnv.GOOGLE_CLIENT_ID,
  clientSecret: appEnv.GOOGLE_CLIENT_SECRET,
  redirectUri: "http://localhost:8080/api/auth/google/callback",
  scope: ["profile", "email"],
});

export type Auth = typeof auth;
