exports.handlesCustomErrors = (err, req, res, next) => {
  const { status, msg } = err;
  if (status) res.status(status).send({ msg });
  else next(err);
};

exports.handles400s = (err, req, res, next) => {};

exports.handles500s = (err, req, res, next) => {
  console.log(err, "<---- ERROR from index");
  res.status(500).send({ msg: "internal server error" });
};

//error controllers
exports.handlesInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "invalid pathway" });
};

exports.handles405s = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};
