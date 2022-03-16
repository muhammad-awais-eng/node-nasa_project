const express = require("express");
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAddAbortLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpAddAbortLaunch);

module.exports = launchesRouter;
