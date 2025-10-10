const User = require("../models/user");

module.exports.renderSignupForm = async(req, res)=> {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res)=> {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=> {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to LandBNB. Get best deals on hotels all over world!");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.login = async(req, res)=> {
    req.flash("success", "Welcome back to LandBNB");
    let redirectUrl = res.locals.originalUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next)=> {
    req.logout((err)=> {
        if(err){
            return next(err);
        }
        req.flash("success", "LogOut from LandBNB");
        res.redirect("/listings");
    });
};