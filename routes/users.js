const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userCallbacks = require("../controllers/users");

router.route("/signup")
    .get(userCallbacks.renderSignupForm)
    .post(wrapAsync(userCallbacks.signup));


//login
router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect:"/", failureFlash:true}), wrapAsync(userCallbacks.login));

//logout
router.get("/logout", userCallbacks.logout);

module.exports = router;