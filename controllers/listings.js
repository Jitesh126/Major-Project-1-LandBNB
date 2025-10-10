const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req, res)=> {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = async(req, res)=> {
    res.render("listings/new.ejs");
};

// module.exports.createNewListing = async(req, res)=> {
//     const url = req.file.path;
//     const filename = req.file.filename;
//     const newListing = req.body.listing;
//     newListing.owner = req.user._id;
//     newListing.image = {url, filename};
//     await Listing.insertOne(newListing);
//     req.flash("success", "listing added successfully!");
//     res.redirect("/listings");
// };


module.exports.createNewListing = async(req, res)=> {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    console.log(response.body.features[0].geometry);

    const newListing = req.body.listing;
    console.log(newListing.catogory);
    newListing.owner = req.user._id;       
    const imagePaths = req.files.map(file => file.path);
    newListing.image = imagePaths;
    newListing.geometry = response.body.features[0].geometry;
    await Listing.insertOne(newListing);
    req.flash("success", "listing added successfully!");
    res.redirect("/listings");
};


module.exports.showListing = async(req, res)=> {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing not exists");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", {listing});
    }
};

module.exports.renderEditForm = async(req, res)=> {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing not exists");
        return res.redirect("/listings");
    }
    const listingImage = listing.image[0].replace("/upload", "/upload/h_80,w_120");

    let listingImage2;
    if(typeof listing.image[1] !== "undefined"){
        listingImage2 = listing.image[1].replace("/upload", "/upload/h_80,w_120");
        return res.render("listings/edit.ejs", {listing, listingImage, listingImage2});  
    }
    res.render("listings/edit.ejs", {listing, listingImage});  
};

// module.exports.editListing = async(req, res)=> {
//     const {id} = req.params;
//     const listing = req.body.listing;
//     const updatedListing = await Listing.findByIdAndUpdate(id, listing);
//     if(typeof req.file !== "undefined"){
//         const url = req.file.path;
//         updatedListing.image[0] = url;
//         console.log(updatedListing);
//         await updatedListing.save();
//     }
//     req.flash("success", "Listing updated successfully");
//     res.redirect(`/listings/${id}`);
// };


module.exports.editListing = async(req, res)=> {
    const {id} = req.params;
    const listing = req.body.listing;
    const updatedListing = await Listing.findByIdAndUpdate(id, listing);
    if(typeof req.files !== "undefined"){
        const url = req.files.map(file => file.path);
        if(typeof url[0] !== "undefined"){
            updatedListing.image[0] = url[0];
        }
        if(typeof url[1] !== "undefined"){
            updatedListing.image[1] = url[1];
        }
        await updatedListing.save();
    }
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async(req, res)=> {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
};

module.exports.searchListing = async(req, res)=> {
    const {q} = req.query;
    const qLc = q.charAt(0).toUpperCase() + q.slice(1);

    let response = await geocodingClient.forwardGeocode({
        query: req.query.q,
        limit: 1
    })
    .send()

    const coordinates = response.body.features[0].geometry.coordinates;
    const coordinates1 = coordinates[0];
    const coordinates2 = coordinates[1];

    const allListings = await Listing.find({country:{$in: [q, qLc]}});
    if(allListings.length > 0){
        return res.render("listings/search.ejs", {allListings, coordinates1, coordinates2});
    }
    req.flash("error", "No such listings found please search for India.");
    res.redirect("/listings");
};

module.exports.searchCatogory = async(req, res) => {
    const catogory = req.query.catogory;
    if(catogory === "Filter"){
        req.flash("error", "select appropiate catogory in filter")
        return res.redirect("/listings");
    }
    const allListings = await Listing.find({catogory: catogory});
    res.render("listings/catogory.ejs", {allListings});
};

module.exports.mountains = async(req, res) => {
    const allListings = await Listing.find({catogory: "Mountains"});
    res.render("listings/catogory.ejs", {allListings});
};

module.exports.beaches = async(req, res) => {
    const allListings = await Listing.find({catogory: "Sand Beaches"});
    res.render("listings/catogory.ejs", {allListings});
}