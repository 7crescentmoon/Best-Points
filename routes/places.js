//express router
const express = require("express");
const router = express.Router();
//constrollers
const PlaceController = require("../controllers/places");
//middleware
const validatePlace = require("../middlewares/validatePlace");
const validateObjectId = require("../middlewares/validateObjectId");
const handleUpload = require("../middlewares/handleUpload");
const isAuth = require("../middlewares/isAuth");
const { isAuthorPlace } = require("../middlewares/isAuthor");
//utils
const wrapAsync = require("../utils/wrapAsync");
//config
const upload = require("../config/multer");

router.route("/")
  .get(wrapAsync(PlaceController.index))
  .post(isAuth,upload.array("image", 5),handleUpload,validatePlace,wrapAsync(PlaceController.store));

router.get("/create",isAuth,wrapAsync(PlaceController.create));

router.get("/:place_id/edit",isAuth,isAuthorPlace,validateObjectId("/places/:place_id"),wrapAsync(PlaceController.edit))

router.route("/:place_id")
  .put(isAuth,isAuthorPlace,upload.array("image", 5),validatePlace,validateObjectId("/places"),wrapAsync(PlaceController.update))
  .delete(isAuth,isAuthorPlace,validateObjectId("/places"),wrapAsync(PlaceController.destroy))
  .get(validateObjectId("/places"),wrapAsync(PlaceController.show))

router.delete('/:place_id/images',isAuth,isAuthorPlace,validateObjectId('/places'),wrapAsync(PlaceController.destroyImages))

module.exports = router;
