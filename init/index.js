const mongoose = require("mongoose");
const Listing = require("../models/listing");
let data = require("./data");

const mongoUrl = "mongodb://127.0.0.1:27017/LandBNB";
main()
    .then(()=> {
        console.log("connected to database");
    })
    .catch((err)=> {
        console.log(err);
    });
async function main() {
    await mongoose.connect(mongoUrl);
}

async function addAllListing() {
    await Listing.deleteMany({});
    data = data.map((obj) => ({...obj, owner: "68deaf24d5374c51aa533279"}));
    await Listing.insertMany(data);
    console.log("data saved");
}

addAllListing();