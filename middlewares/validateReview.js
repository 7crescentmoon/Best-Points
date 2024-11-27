const schemaReview = require("../schemas/review");
const ErrorHandler = require("../utils/ErrorHandler");
const validateReview = (req, res, next) => {
  const { error } = schemaReview.validate(req.body, { abortEarly: false });

  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  }else {
    next()
  }

};

module.exports = validateReview;