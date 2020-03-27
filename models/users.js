const connection = require("../db/connection");

exports.fetchUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(username => {
      if (username.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "username doesn't exist"
        });
      }
      return username[0];
    });
};

exports.checkIfAuthorExists = ({ author }) => {
  if (author) {
    return connection("users")
      .first()
      .where("users.username", "=", author)
      .then(author => {
        if (author === undefined) {
          return Promise.reject({
            status: 404,
            msg: "author doesn't exist"
          });
        }
      });
  }
};
