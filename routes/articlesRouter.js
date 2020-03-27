const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getAllArticles
} = require("../controllers/articles");

const {
  postCommentByArticleId,
  getCommentByArticleId
} = require("../controllers/comments");

const { handle405s } = require("../errors");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(handle405s);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentByArticleId)
  .all(handle405s);

module.exports = articlesRouter;
