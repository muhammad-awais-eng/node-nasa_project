const http = require("http");
require("dotenv").config();

const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./modal/planets.model");
const { loadLaunchesData } = require("./modal/launches.model");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startserver() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startserver();
