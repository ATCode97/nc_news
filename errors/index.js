exports.handleCustomErrors = (err, req, res, next) => {
  const { status, msg } = err;
  if (status) res.status(status).send({ msg });
  else next(err);
};

exports.handle400s = (err, req, res, next) => {
  const { code } = err;
  const errors400 = ["22P02", "42703", "23502"];

  if (errors400.includes(code)) res.status(400).send({ msg: "bad request" });
  else next(err);
};

exports.handle422s = (err, req, res, next) => {
  const { code } = err;
  const errors400 = ["23503"];

  if (errors400.includes(code))
    res.status(422).send({ msg: "unprocessable entity" });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err, "<---- ERROR from index");
  res.status(500).send({ msg: "internal server error" });
};

exports.handleInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "invalid pathway" });
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};
