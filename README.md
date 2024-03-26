# NutriShare

## Running

We use pnpm for package management and bun as the runtime.

1. Install project dependencies: `pnpm i`
2. Set up the `.env` file with database credentials and OAuth2 provider secrets
3. Start the database: `docker compose up -d`
4. Migrate the database: `pnpm db:migrate`
5. Run the project: `bun dev`
6. Open http://localhost:3000/ in your browser

To run the mobile app (Expo), you need to start it separately, as their CLI doesn't fully work when running non-interatively:

1. Install the development build
2. `pnpm --filter mobile dev`
  - When running in WSL, you might need to add the `--localhost` flag and open the port to the world
  - Normally, the dev client should be open on the local network
3. Open the development client on your phone
4. Connect to the dev client
