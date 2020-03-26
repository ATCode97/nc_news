const {
  updateCommentById,
  removeCommentById,
  addCommentByArticleId,
  fetchCommentByArticleId
} = require("../models/comments");

const { checkIfArticleIdExist } = require("../models/articles");

exports.getCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    fetchCommentByArticleId(article_id, req.query),
    checkIfArticleIdExist(article_id)
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id: id } = req.params;
  const { body } = req;
  addCommentByArticleId(id, body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id: Id } = req.params;
  const { inc_votes: votes } = req.body;

  updateCommentById(Id, votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id: Id } = req.params;
  removeCommentById(Id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
