const multer = require("multer");

module.exports = async (err, req, res, next) => {
   // Cek jika error berasal dari multer
   if (err instanceof multer.MulterError) {
    // Error jika file melebihi batas maksimal
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      req.flash("error_msg", "You can upload a maximum of 5 images.");
      return res.redirect("/places/create");
    }
  } else if (err) {
    // Error umum lainnya
    req.flash("error_msg", err.message || "An error occurred during upload.");
    return res.redirect("/places/create");
  }
  next();
};
