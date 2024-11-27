const fs = require("fs");
//models
const Place = require("../models/place");
//utils
const hereMaps = require("../utils/hereMaps");
const ErrorHandler = require("../utils/ErrorHandler");

const index = async (req, res) => {
  const places = await Place.find().populate("author");
  const clusteringPlace = places.map(place => {
    return {
      latitude: place.geometry.coordinates[1],
      longitude: place.geometry.coordinates[0]
    }
  })
  const clusteredPlace = JSON.stringify(clusteringPlace)
  return res.render("places/index", { places, page: "All", clusteredPlace });
};

const create = async (req, res) => {
  return res.render("places/create", {
    page: "Create Place",
    errorDetails: {},
  });
};

const store = async (req, res) => {
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  const geoData = await hereMaps.geometry(req.body.place.location);

  const places = new Place({ ...req.body.place });
  places.images = images;
  places.author = req.user._id;
  places.geometry = geoData;
  await places.save();
  req.flash("success_msg", "New Place added Successfully");
  return res.redirect(`places/${places._id}`);
};

const edit = async (req, res) => {
  const { place_id } = req.params;

  const place = await Place.findById(place_id);
  return res.render("places/edit", { place, page: "Edit Place" });
};

const update = async (req, res) => {
  const { place_id } = req.params;
  const { place } = req.body;
  const geoData = await hereMaps.geometry(place.location);
  const newPlace = await Place.findByIdAndUpdate(
    place_id,
    { ...place, geometry: geoData },
    { runValidators: true }
  );

  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  newPlace.images.push(...images);
  await newPlace.save();
  // }
  req.flash("success_msg", "Update Place Successfully");
  return res.redirect(`/places/${place_id}`);
};

const destroy = async (req, res) => {
  const { place_id } = req.params;
  const place = await Place.findByIdAndDelete(place_id);

  if (place.images.length >= 0) {
    place.images.forEach((image) => {
      fs.unlink(image.url, (err) => new ErrorHandler(err));
    });
  }

  await place.deleteOne();

  req.flash("success_msg", "Delete Place Successfully");
  return res.redirect("/places");
};

const destroyImages = async (req, res) => {
  const { place_id } = req.params;
  try {
    const { images } = req.body;

    if (!images || images.length === 0) {
      req.flash("error_msg", "Please select at lest one image");
      return res.redirect(`/places/${place_id}`);
    }

    images.forEach((image) => {
      fs.unlinkSync(image);
    });

    await Place.findByIdAndUpdate(
      place_id, 
      { $pull: { images: { url: { $in: images } } },
    });

    req.flash("success_msg", "Edit Place Successfully");
    return res.redirect(`/places/${place_id}/edit`);
  } catch (error) {
    console.log(error);
    req.flash("error_msg", "filed to delete images");
    return res.redirect(`/places/${place_id}/edit`);
  }
};

const show = async (req, res) => {
  const { place_id } = req.params;
  const place = await Place.findById(place_id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
      sort: { createdAt: -1 },
    })
    .populate("author");

  return res.render("places/show", { place, page: "Show Place"});
};

module.exports = {
  index,
  create,
  store,
  edit,
  update,
  destroy,
  show,
  destroyImages,
};
