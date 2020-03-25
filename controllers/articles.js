const {
  fetchArticleById,
  updateArticleById,
  addCommentToArticle,
  fetchCommentByArticleId,
  fetchAllArticles
} = require("../models/articles");

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

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id: id } = req.params;
  const { body } = req;
  addCommentToArticle(id, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentByArticleId = (req, res, next) => {
  const { article_id: id } = req.params;

  fetchCommentByArticleId(id, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
