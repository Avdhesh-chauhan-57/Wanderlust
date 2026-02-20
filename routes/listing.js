const express = require("express");
const router =express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const{isLoggedIn ,isOwner,validateListing} = require("../Middleware.js");
const { findById } = require("../models/review.js");
const listingController = require("../controllers/lisitng.js");

const multer  = require('multer');
const{storage} =require("../cloudconfig.js");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
     upload.single("listing[image]") ,
     validateListing,
     wrapAsync(listingController.createListing));

router.get("/new" ,isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync( listingController.showListing))
.put(isLoggedIn,
      isOwner, 
       upload.single("listing[image]"),
       validateListing,
       wrapAsync( listingController.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync( listingController.deleteListing));

// Edit Routes//
router.get("/:id/edit" , isLoggedIn, isOwner,wrapAsync(listingController.editListing));

module.exports= router;


