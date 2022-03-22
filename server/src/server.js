const http = require("http");

const app = require("./app");
const { mongoConnect } = require("./services/mongo");

const { loadPlanetsData } = require("./modal/planets.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startserver() {
  await mongoConnect();
  await loadPlanetsData();
}

startserver();
