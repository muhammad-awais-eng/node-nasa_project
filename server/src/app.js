const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
var bodyParser = require("body-parser");

const api = require("./routes/api");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use("/v1", api);
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
