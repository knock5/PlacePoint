const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// models
const Place = require("./models/Place");

// connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1/placepoint")
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/seed/place", async (req, res) => {
//   const place = new Place({
//     title: "Barata Cafee",
//     price: "200",
//     description: "Beautiful Caffe for hangout",
//     location: "Indonesia",
//   });

//   await place.save();
//   res.send("Place created: " + place);
// });

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running... http://localhost:${port}`);
});
