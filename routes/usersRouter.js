const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users");
const { handles405s } = require("../errors");

usersRouter.route("/").all(handles405s);
usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handles405s);

module.exports = usersRouter;
