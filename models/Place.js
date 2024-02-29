const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("Place", placeSchema);
