const connection = require("../db/connection");

exports.addCommentByArticleId = (articleId, comment) => {
  const newObj = {};
  newObj.author = comment.username;
  newObj.body = comment.body;
  newObj.article_id = articleId;

  return connection
    .from("comments")
    .insert(newObj)
    .returning("*")
    .then(comment => {
      return comment[0];
    });
};

exports.fetchCommentByArticleId = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  return connection
    .select("comments.*")
    .from("comments")
    .leftJoin("articles", "comments.article_id", "=", "articles.article_id")
    .groupBy("comments.comment_id")
    .where("comments.article_id", "=", article_id)
    .orderBy(sort_by, order);
};

exports.updateCommentById = (comment_id, votes) => {
  return connection
    .select("*")
    .from("comments")
    .where({ comment_id })
    .increment("votes", votes)
    .returning("*")
    .then(comment => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment_id for update doesn't exist"
        });
      }
      return comment[0];
    });
};

exports.removeCommentById = comment_id => {
  return connection
    .from("comments")
    .where({ comment_id })
    .del()
    .then(deleteCount => {
      if (deleteCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment_id for delete doesn't exist"
        });
      }
    });
};
