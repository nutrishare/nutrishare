import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma";
import { lucia } from "lucia";
import { elysia } from "lucia/middleware";
import { prisma } from "@nutrishare/db";
import { github } from "@lucia-auth/oauth/providers";
import appEnv from "./env";

export const auth = lucia({
  env: "DEV", // TODO: Allow "PROD"
  middleware: elysia(),
  adapter: prismaAdapter(prisma, {
    user: "user",
    key: "authKey",
    session: null,
  }),
  getUserAttributes: (data) => ({
    githubUsername: data.username,
  }),
});

export const githubAuth = github(auth, {
  clientId: appEnv.GITHUB_CLIENT_ID,
  clientSecret: appEnv.GITHUB_CLIENT_SECRET,
});

export type Auth = typeof auth;
