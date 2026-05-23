const createApp = require("./src/app");
const { connectDb, getCollections } = require("./src/db/client");
const { seedAdminIfNeeded } = require("./src/controllers/authController");
const { seedBooksIfNeeded } = require("./src/db/seeder");

let appPromise;

async function getApp() {
  if (!appPromise) {
    appPromise = (async () => {
      const client = await connectDb();
      const collections = getCollections(client);
      await seedAdminIfNeeded(collections);
      await seedBooksIfNeeded(collections);
      return createApp({ collections });
    })();
  }
  return appPromise;
}

module.exports = async (req, res) => {
  const app = await getApp();
  return app(req, res);
};
