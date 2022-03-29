const axios = require("axios");

const launchesDataBase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Loading launches data");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Error loading launches data");
    throw new Error("Launches data not loaded");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };

    console.log(`${launch.flightNumber} - ${launch.mission}`);
  }
}

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1", // rocket.name
  launchDate: new Date("December 27,2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunchData(launch);

async function loadLaunchesData() {
  const fistLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (fistLaunch) {
    console.log("Launch data already loaded");
  } else {
    populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDataBase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await launchesDataBase.findOne({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDataBase.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launchesDataBase
    .find(
      {},
      {
        __id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunchData(launch) {
  await launchesDataBase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOneAndUpdate({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("planets not Found ... !!!");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["frontend", "backend"],
    flightNumber: newFlightNumber,
  });
  await saveLaunchData(newLaunch);
}

async function abortLaunchById(launchId) {
  return await launchesDataBase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
}

module.exports = {
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
