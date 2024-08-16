# Fowlfield

Fowlfield is a web app designed for running [Bunnybots](https://team1540.org/bunnybots), an FRC-style robotics event without a full FMS.
It includes:
- BunnyBots specific scoring tools
- Audience display and match timer
- 4-alliance double elimination playoff bracket
- TBA Integration
- BunnyBots-style ranking calculations


## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up a mongodb instance with [replica sets enabled](https://www.prisma.io/docs/orm/overview/databases/mongodb#replica-set-configuration)
4. Add the mongo db url as the environment variable `DATABASE_URL`, either in a `.env` file or by declaring it manually
5. Copy the `config/example.json` to `config/default.json` and fill in the necessary values
5. Run `prisma migrate deploy` to set up the database schema
6. Run `npm run backend:build; npm run frontend:build` to build the app, then `node build/server.js` from the base directory to run it.

