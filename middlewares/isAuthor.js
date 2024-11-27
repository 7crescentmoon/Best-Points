const Place = require("../models/place");
const Review = require("../models/review");

module.exports.isAuthorPlace = async (req, res, next) => {
  const { place_id } = req.params;
  const place = await Place.findById(place_id);

  if (!place.author.equals(req.user._id)) {
    req.flash("error_msg", "You are not allowed to this place");
    return res.redirect(`/places`);
  }
  next()
};

module.exports.isAuthorReview = async (req, res, next) => {
  const { place_id, review_id } = req.params;
  const review = await Review.findById(review_id);

  if (!review.author.equals(req.user._id)) {
    req.flash("error_msg", "Not Allowed");
    return res.redirect(`/places/${place_id}`);
  }
  next()
};
