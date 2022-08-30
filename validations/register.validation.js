const Joi = require("joi");

module.exports.validate = function (User) {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    password: Joi.string().min(3).max(15).required(),
  }).unknown();

  return schema.validate(User);
};
