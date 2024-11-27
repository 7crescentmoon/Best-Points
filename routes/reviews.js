//express router
const express = require("express");
const router = express.Router({ mergeParams: true });
//constrollers
const ReviewController = require("../controllers/reviews");
//middleware
const validateReview = require("../middlewares/validateReview");
const validateObjectId = require('../middlewares/validateObjectId')
const isAuth = require('../middlewares/isAuth')
const {isAuthorReview} = require('../middlewares/isAuthor')
//utils
const wrapAsync = require("../utils/wrapAsync");

router.post("/",validateReview,isAuth,validateObjectId('/places'),wrapAsync(ReviewController.store))

router.delete("/:review_id",isAuth,isAuthorReview ,validateObjectId('/places'),wrapAsync(ReviewController.destroy))

module.exports = router;
