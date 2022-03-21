const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("it should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test Post /launches", () => {
  test("it should   respond  with 200 success", async () => {
    const completeLaunchDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-186 f",
      launchDate: "January 4, 2028",
    };

    const launchDataWithOutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-186 f",
      launchDate: "January 4, 2028",
    };

    const response = await request(app)
      .post("/launches")
      .send(completeLaunchDate)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchDate.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(launchDataWithOutDate);
  });
});
