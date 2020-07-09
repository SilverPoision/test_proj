const mongo = require("mongoose");
const { string } = require("@hapi/joi");

const userSchema = new mongo.Schema({
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  sessToken: [
    {
      type: String,
    },
  ],
  password: {
    type: String,
    required: true,
    min: 10,
    max: 525,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpires: {
    type: Date,
    required: false,
  },
  isPassReset: {
    type: Boolean,
    default: false,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
});

module.exports = mongo.model("User", userSchema);
