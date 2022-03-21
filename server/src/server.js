const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");

const { loadPlanetsData } = require("./modal/planets.model");

const PORT = process.env.PORT || 8000;
const MONGO_URL =
  "mongodb+srv://nasa-api:admin123@cluster0.jarvl.mongodb.net/nasadb?retryWrites=true&w=majority";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

async function startserver() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startserver();
