const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics");
const { handles405s } = require("../errors");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(handles405s);

module.exports = topicsRouter;
