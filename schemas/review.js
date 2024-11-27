const joi = require("joi");

const schemaReview = joi.object({
  review: joi
    .object({
      rating: joi.number().min(1).max(5).required().empty(''),
      body: joi.string().required().empty('')
    }).required(),
});

module.exports = schemaReview;
