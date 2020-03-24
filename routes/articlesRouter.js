const articlesRouter = require("express").Router();
const { getArticleById } = require("../controllers/articles");

articlesRouter.use("/article_id", getArticleById);

module.exports = articlesRouter;
