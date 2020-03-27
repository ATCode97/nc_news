const endpoints = require("../endpoints.json");

exports.getEndPointsInfo = (req, res, next) => {
  res.status(200).send({ endpoints });
};
