exports.handles500s = (err, req, res, next) => {
  // console.log(err, "<---- ERROR from index");
  res.status(500).send({ msg: "internal server error" });
};

//error controllers
exports.handlesInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "invalid pathway" });
};
