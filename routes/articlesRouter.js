const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentByArticleId,
  getAllArticles
} = require("../controllers/articles");
const { handles405s } = require("../errors");

articlesRouter.route("/").get(getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handles405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentByArticleId);

module.exports = articlesRouter;