const express = require("express");
const apiRouter = require("./routes/apiRouter");
const { handlesInvalidPaths, handles500s } = require("./errors");

const app = express();

app.use("/api", apiRouter);

app.all("/*", handlesInvalidPaths);

app.use(handles500s);

module.exports = app;
