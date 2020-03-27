const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const { getEndPointsInfo } = require("../controllers/api");

const { handle405s } = require("../errors");

apiRouter
  .route("/")
  .get(getEndPointsInfo)
  .all(handle405s);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
