const { getAllPlanets } = require("../../modal/planets.model");

async function httpGetAllPlanets(req, res) {
  console.log("httpGetAllPlanets", getAllPlanets());
  return res.status(200).json(await getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
