const { updateCommentById, removeCommentById } = require("../models/comments");

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
