const connection = require("../connection");

exports.fetchArticleById = articleId => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", "=", articleId)
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id doesn't exist"
        });
      }
      return res[0];
    });
};

exports.updateArticleById = (articleId, newVotes) => {
  return connection
    .select("*")
    .from("articles")
    .where("articles.article_id", "=", articleId)
    .increment("votes", newVotes)
    .returning("*")
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article for update, doesn't exist"
        });
      }
      return res[0];
    });
};

exports.addCommentToArticle = (articleId, comment) => {
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
      if (res.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id doesn't exist"
        });
      }
      return res;
    });
};

// SELECT comments.* FROM comments
// LEFT JOIN articles
//ON comments.article_id = articles.article_id
// GROUP BY comments.comment_id;
