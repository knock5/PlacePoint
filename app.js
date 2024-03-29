const ejsMate = require("ejs-mate");
const express = require("express");
const ExpressError = require("./utils/ErrorHandler");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const wrapAsync = require("./utils/wrapAsync");
const path = require("path");
const app = express();

// models
const Place = require("./models/Place");

// schemas
const { placeSchema } = require("./schemas/place");

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1/placepoint")
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.log(err);
  });

// set engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/places",
  wrapAsync(async (req, res) => {
    const places = await Place.find();
    res.render("places/index", { places });
  })
);

app.get("/places/create", (req, res) => {
  res.render("places/create");
});

// create new place
app.post(
  "/places",
  validatePlace,
  wrapAsync(async (req, res) => {
    const place = new Place(req.body.place);
    await place.save();
    res.redirect("/places");
  })
);

app.get(
  "/places/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("places/edit", { place });
  })
);

// edit by id
app.put(
  "/places/:id",
  validatePlace,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndUpdate(id, { ...req.body.place });
    res.redirect("/places");
  })
);

// get by id
app.get(
  "/places/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("places/show", { place });
  })
);

// delete by id
app.delete(
  "/places/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.redirect("/places");
  })
);

// general route
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// error message
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running... http://localhost:${port}`);
});
