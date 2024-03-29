const Joi = require("joi");

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().min(3).required(),
  }).required(),
});
