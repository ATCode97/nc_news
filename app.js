const express = require("express");
const apiRouter = require("./routes/apiRouter");
const {
  handlesInvalidPaths,
  handlesCustomErrors,
  handles400s,
  handles500s
} = require("./errors");

const app = express();

app.use("/api", apiRouter);

app.all("/*", handlesInvalidPaths);

app.use(handlesCustomErrors);

app.use(handles400s);

app.use(handles500s);

module.exports = app;
