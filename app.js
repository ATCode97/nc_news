const express = require("express");
const apiRouter = require("./routes/apiRouter");
const cors = require("cors");
const app = express();
const {
  handleInvalidPaths,
  handleCustomErrors,
  handle400s,
  handle422s,
  handle500s,
} = require("./errors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handleInvalidPaths);

app.use(handleCustomErrors);

app.use(handle400s);

app.use(handle422s);

app.use(handle500s);

module.exports = app;
