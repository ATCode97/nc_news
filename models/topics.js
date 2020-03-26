const connection = require("../connection");

exports.fetchAllTopics = () => {
  return connection.select("*").from("topics");
};
exports.checkIfTopicExists = ({ topic }) => {
  if (topic) {
    return connection("topics")
      .first()
      .where("topics.slug", "=", topic)
      .then(topic => {
        if (topic === undefined) {
          return Promise.reject({
            status: 404,
            msg: "topic doesn't exist"
          });
        }
      });
  }
};
