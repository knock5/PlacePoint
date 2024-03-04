const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// models
const Place = require("./models/Place");

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

app.get("/places", async (req, res) => {
  const places = await Place.find();
  res.render("places/index", { places });
});

app.get("/places/create", (req, res) => {
  res.render("places/create");
});

// create new place
app.post("/places", async (req, res) => {
  const place = new Place(req.body.place);
  await place.save();
  res.redirect("/places");
});

app.get("/places/:id/edit", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.render("places/edit", { place });
});

// edit by id
app.put("/places/:id", async (req, res) => {
  const { id } = req.params;
  await Place.findByIdAndUpdate(id, { ...req.body.place });
  res.redirect("/places");
});

// get by id
app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.render("places/show", { place });
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
