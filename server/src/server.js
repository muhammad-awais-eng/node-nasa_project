const http = require("http");
const app = require("./app");

const { loadPlanetsData } = require("./modal/planets.model");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startserver() {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startserver();
