const { fetchArticleById, updateArticleById } = require("../models/articles");

exports.getArticleById = (req, res, next) => {
  const { article_id: articleId } = req.params;
  fetchArticleById(articleId)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id: id } = req.params;
  const { inc_votes: newVotes } = req.body;

  updateArticleById(id, newVotes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
