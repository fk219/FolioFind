const createApp = require("./app");
const { connectDb, getCollections } = require("./db/client");
const { port } = require("./config");
const { seedAdminIfNeeded } = require("./controllers/authController");

async function start() {
  const client = await connectDb();
  const collections = getCollections(client);
  await seedAdminIfNeeded(collections);

  const app = createApp({ collections });
  app.listen(port, () => {
    process.stdout.write(`API listening on ${port}\n`);
  });
}

start().catch((err) => {
  process.stderr.write(`${err?.stack || err}\n`);
  process.exit(1);
});
