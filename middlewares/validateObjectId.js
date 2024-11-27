const mongoose = require("mongoose");

function validateObjectId(redirectUrl) {
  return async (req, res, next) => {
    const paramID = ["id", "place_id", "review_id"].find(
      (param) => req.params[param]
    );

    if (!paramID) {
      return next();
    }

    const id = req.params[paramID];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error_msg", "Invalid ID or Data not found");
      return res.redirect(redirectUrl);
    }
    next();
  };
}

module.exports = validateObjectId;
