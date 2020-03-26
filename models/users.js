const connection = require("../connection");

exports.fetchUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where("users.username", "=", username)
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "username doesn't exist"
        });
      }
      return res[0];
    });
};

exports.checkIfAuthorExists = ({ author }) => {
  if (author) {
    return connection("users")
      .first()
      .where("users.username", "=", author)
      .then(res => {
        if (res === undefined) {
          return Promise.reject({
            status: 404,
            msg: "author doesn't exist"
          });
        }
      });
  }
};
