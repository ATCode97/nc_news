const express = require("express");
const apiRouter = require("./routes/apiRouter");
const app = express();
const {
  handlesInvalidPaths,
  handlesCustomErrors,
  handles400s,
  handles422s,
  handles500s
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handlesInvalidPaths);

app.use(handlesCustomErrors);

app.use(handles400s);

app.use(handles422s);

app.use(handles500s);

module.exports = app;
