const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req, res)=> {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "New Review added");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async(req, res)=> {
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", `Review deleted successfully`);
    res.redirect(`/listings/${id}`);
};