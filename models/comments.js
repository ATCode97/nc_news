const connection = require("../connection");

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
