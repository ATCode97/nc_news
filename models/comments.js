const connection = require("../connection");

exports.addCommentByArticleId = (articleId, comment) => {
  const newObj = {};
  newObj.author = comment.username;
  newObj.body = comment.body;
  newObj.article_id = articleId;

  return connection
    .from("comments")
    .insert(newObj)
    .returning("*")
    .then(res => {
      return res[0];
    });
};

exports.fetchCommentByArticleId = (
  articleId,
  { sort_by = "created_at", order = "desc" }
) => {
  return connection
    .select("comments.*")
    .from("comments")
    .leftJoin("articles", "comments.article_id", "=", "articles.article_id")
    .groupBy("comments.comment_id")
    .where("comments.article_id", "=", articleId)
    .orderBy(sort_by, order)
    .then(res => {
      return res;
    });
};

exports.updateCommentById = (commentId, votes) => {
  return connection
    .select("*")
    .from("comments")
    .where("comments.comment_id", "=", commentId)
    .increment("votes", votes)
    .returning("*")
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment_id for update doesn't exist"
        });
      }
      return res[0];
    });
};

exports.removeCommentById = commentId => {
  return connection
    .from("comments")
    .where("comments.comment_id", "=", commentId)
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
