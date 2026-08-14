const { Schema, model } = require("mongoose");

const HeroeSchema = Schema({
  superhero: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
    enum: ["DC Comics", "Marvel Comics"],
  },
  alter_ego: {
    type: String,
    required: true,
  },
  first_appearance: {
    type: String,
    required: true,
  },
  characters: {
    type: String,
    required: true,
  },
  alt_img: {
    type: String,
  },
  seeded: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Heroe", HeroeSchema);
