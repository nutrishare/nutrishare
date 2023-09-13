import Elysia from "elysia";

const authMiddleware = new Elysia().derive(async ({ jwt, headers, set }) => {});
export default authMiddleware;
