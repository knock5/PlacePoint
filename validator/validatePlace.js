const ExpressError = require("../utils/ErrorHandler");
const { placeSchema } = require("../schemas/place");

module.exports.validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
