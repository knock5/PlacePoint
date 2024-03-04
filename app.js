const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// models
const Place = require("./models/Place");

// middkewares
app.use(express.urlencoded({ extended: true }));

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

app.post("/places", async (req, res) => {
  const place = new Place(req.body.place);
  await place.save();
  res.redirect("/places");
});

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
