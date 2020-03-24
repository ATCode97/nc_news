const { fetchArticleById } = require("../models/articles");

exports.getArticleById = (req, res, next) => {
  fetchArticleById();
};
