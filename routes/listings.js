const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const { isLoggedIn, isOwner } = require("../middleware");
const listingCallbacks = require("../controllers/listings");
const multer  = require('multer');
const { storage } = require("../cloudConfig");
const upload = multer({ storage });


//middleware fn for validate listing
const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        const errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
}

router.route("/")
    .get(wrapAsync(listingCallbacks.index))
    .post(isLoggedIn, upload.array("listing[image]", 2), validateListing, wrapAsync(listingCallbacks.createNewListing));


router.get("/new", isLoggedIn, wrapAsync(listingCallbacks.renderNewForm));

router.get("/search",wrapAsync(listingCallbacks.searchListing));

router.get("/catogory", wrapAsync(listingCallbacks.searchCatogory));

router.get("/catogory/mountains", wrapAsync(listingCallbacks.mountains));
router.get("/catogory/beaches", wrapAsync(listingCallbacks.beaches));

router.route("/:id")
    .get(wrapAsync(listingCallbacks.showListing))
    .put(isLoggedIn, isOwner, upload.array('listing[image]',2), validateListing, wrapAsync(listingCallbacks.editListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingCallbacks.deleteListing));


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingCallbacks.renderEditForm));

module.exports = router;