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

const { handles405s } = require("../errors");

articlesRouter
  .route("/")
  .get(getAllArticles)
  .all(handles405s);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handles405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentByArticleId)
  .all(handles405s);

module.exports = articlesRouter;
