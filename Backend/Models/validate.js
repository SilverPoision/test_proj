const joi = require("@hapi/joi");

exports.emailSchema = (data) => {
  schema = joi.object({
    email: joi.string().min(6).required().email(),
  });
  return schema.validate(data);
};

exports.loginSchema = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

exports.forgot_Valid = (data) => {
  const schema = joi.object({
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

exports.editUserSchema = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).required().email(),
    newemail: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

exports.lat_long = (data) => {
  const schema = joi.object({
    latitude: joi.number().required(),
    longitude: joi.number().required(),
  });
  return schema.validate(data);
};
