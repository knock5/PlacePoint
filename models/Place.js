const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
});

module.exports = mongoose.model("Place", placeSchema);
