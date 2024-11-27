const joi = require("joi");

const schemaPlace = joi.object({
  place: joi
    .object({
      title: joi.string().required().empty('').messages({
        'any.required': 'Title is required',}),
      price: joi.number().min(0).required().empty('').messages({
        'price.positive': 'Price must be a positive number',
        'any.required': 'Price is required',
        'number.base': 'Price must be a number',
      }),
      description: joi.string().required().empty('').messages({
        'any.required': 'Description is required',
      }),
      location: joi.string().required().empty('').messages({
        'any.required': 'Location is required',
      }),
      // images: joi.string().required(),
    })
    .required(),
});

module.exports = schemaPlace;
