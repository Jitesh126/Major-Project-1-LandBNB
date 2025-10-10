const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next)=> {
    if(!req.isAuthenticated()){
        req.session.originalUrl = req.originalUrl;
        req.flash("error", "You must be first login to LandBNB");
        return res.redirect("/");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=> {
    if(req.session.originalUrl){
        res.locals.originalUrl = req.session.originalUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next)=> {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error", "You have not hosted this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next)=> {
    const {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error", "you are not the author of that review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}