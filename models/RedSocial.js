const { Schema, model } = require("mongoose");

const RedSocialSchema = Schema({
  red: {
    type: String,
    required: true,
    unique: true,
  },
  seguidores: {
    type: Number,
    required: true,
  },
  seeded: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("RedSocial", RedSocialSchema);
