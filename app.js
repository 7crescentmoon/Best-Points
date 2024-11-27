const express = require("express");
const app = express();
const engine = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const ErrorHandler = require("./utils/ErrorHandler");
const wrapAsync = require("./utils/wrapAsync");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user");
const hereMaps = require("./utils/hereMaps");
//connect to db
mongoose
.connect("mongodb://127.0.0.1/bestpoints-db")
.then(() => {
  console.log("Db connect");
})
.catch((err) => {
  console.log(err); 
});

require('dotenv').config();

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.isAuth = req.user
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
})

app.get("/", (req, res) => {
  res.render("home", { page: "home" });
});

app.use('/places', require('./routes/places'));
app.use('/places/:place_id/review', require('./routes/reviews'));
app.use('/',require('./routes/auth'));
app.get(
  "*",
  wrapAsync(async (req, res, next) => {
    next(new ErrorHandler("Page Not Found", 404));
  })
);

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(status).render("error/error", { err, page: {} });
});

app.listen(3000, () => {
  console.log("Listening on port 3000 http://127.0.0.1:3000");
});
