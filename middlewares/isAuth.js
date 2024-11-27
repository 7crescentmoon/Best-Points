module.exports = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        req.flash("error_msg", "Please Login First");
        return res.redirect("/login");
    }
    next()
}