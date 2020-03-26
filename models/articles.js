const connection = require("../connection");

exports.fetchArticleById = articleId => {
  return connection
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", "=", articleId)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article_id doesn't exist"
        });
      }
      return article[0];
    });
};

exports.updateArticleById = (articleId, newVotes = 0) => {
  return connection
    .select("*")
    .from("articles")
    .where("articles.article_id", "=", articleId)
    .increment("votes", newVotes)
    .returning("*")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article for update, doesn't exist"
        });
      }
      return article[0];
    });
};

exports.fetchAllArticles = ({
  sort_by = "created_at",
  order = "desc",
  author,
  topic
}) => {
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
    });
};

exports.checkIfArticleIdExist = article_id => {
  return connection("articles")
    .first()
    .where({ article_id })
    .then(article => {
      if (article === undefined)
        return Promise.reject({
          status: 404,
          msg: "article_id doesn't exist"
        });
    });
};
