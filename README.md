# NutriShare

## Running

We use pnpm for package management and bun as the runtime.

1. Install project dependencies: `pnpm i`
2. Set up the `.env` file with database credentials and OAuth2 provider secrets
3. Start the database: `docker compose up -d`
4. Migrate the database: `bunx prisma migrate deploy --schema packages/db/prisma/schema.prisma`
5. Run the project: `bun dev`
6. Open http://localhost:3000/ in your browser
