const connection = require("../connection");

exports.fetchUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where("users.username", "=", username)
    .then(res => {
      return res[0];
    });
};
