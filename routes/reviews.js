const express = require("express");
const router = express.Router({mergeParams: true});
const { reviewSchema } = require("../schema");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewcallbacks = require("../controllers/reviews");


//middleware fn for validate review
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        const errmsg = error.details.map( (el) => el.message).join(",");
        throw new ExpressError(404, errmsg);
    } else {
        next();
    }
}

//Reviews
// create review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewcallbacks.createReview));

//destroy review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewcallbacks.deleteReview));

module.exports = router;