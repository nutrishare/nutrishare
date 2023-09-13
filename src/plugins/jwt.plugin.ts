import jwt from "@elysiajs/jwt";

export default jwt({
    name: "jwt",
    secret: Bun.env.JWT_SECRET!,
    exp: "7d",
})
