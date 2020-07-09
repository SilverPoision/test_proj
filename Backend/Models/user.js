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
    default: 23.435453454345,
  },
  longitude: {
    type: String,
    default: 55.54534545345,
  },
});

module.exports = mongo.model("User", userSchema);
