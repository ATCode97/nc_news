const commentsRouter = require("express").Router();
const {
  patchCommentById,
  deleteCommentById
} = require("../controllers/comments");
const { handles405s } = require("../errors");

commentsRouter.route("/").all(handles405s);

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(handles405s);

module.exports = commentsRouter;
