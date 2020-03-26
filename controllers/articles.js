const {
  fetchArticleById,
  updateArticleById,
  fetchAllArticles
} = require("../models/articles");

const { checkIfAuthorExists } = require("../models/users");
const { checkIfTopicExists } = require("../models/topics");

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

exports.getAllArticles = (req, res, next) => {
  Promise.all([
    fetchAllArticles(req.query),
    checkIfAuthorExists(req.query),
    checkIfTopicExists(req.query)
  ])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
