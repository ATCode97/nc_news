const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId
} = require("../controllers/articles");
const { handles405s } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handles405s);

articlesRouter.route("/:article_id/comments").post(postCommentByArticleId);

module.exports = articlesRouter;
