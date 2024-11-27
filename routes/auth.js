//express router
const express = require("express");
const router = express.Router();
//constrollers
const AuthController = require("../controllers/auth");
//utils
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.route("/register")
    .get(wrapAsync(AuthController.registerView))
    .post(wrapAsync(AuthController.register))

router.route("/login")
    .get(wrapAsync(AuthController.loginView))
    .post(passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: {
        type: "error_msg",
        message: "Invalid Username or Password"
    }
}), wrapAsync(AuthController.login))

router.post('/logout', wrapAsync(AuthController.logout))

module.exports = router;