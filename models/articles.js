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

exports.fetchAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
  // if (order !== "desc" || "asc") {
  //   order = "desc";
  // }

  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify(query => {
      if (author) query.where("articles.author", "=", author);
      if (topic) query.where("articles.topic", "=", topic);
    })
    .then(res => {
      return res;
    });
};

exports.checkIfArticleIdExist = article_id => {
  return connection("articles")
    .first()
    .where({ article_id })
    .then(res => {
      if (res === undefined)
        return Promise.reject({
          status: 404,
          msg: "article_id doesn't exist"
        });
    });
};
