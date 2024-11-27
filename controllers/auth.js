//models
const User = require("../models/user");

const registerView = async (req, res) => {
    return res.render("auth/register", { req,page: "Register" });
}

const register = async (req, res) => {
    const {username, email, password} = req.body
    const user = new User({username, email})
    const existingUser = await User.findOne({email})
    try {
        const registeredUser = await User.register(user, password)

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success_msg", "Register Successfully, Welcome to BestPoints");
            return res.redirect("/places");
        });
       
    } catch (error) { 
        if (existingUser) {
            req.flash("error_msg", `Email ${email} already registered. Please use another one.`);
            return res.redirect("/register");
        }
        req.flash("error_msg", error.message)
        return res.redirect("/register")
    }
}

const loginView = async (req, res) => {
    return res.render("auth/login", { req,page: "Login" });
}
const login = async (req, res) => {
    req.flash("success_msg", "Login Successfully")
    return res.redirect("/places");
}

const logout = async (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success_msg", "Logout Successfully");
        return res.redirect("/login");
    });
}

module.exports = {
    registerView,
    register,
    loginView,
    login,
    logout
}