const express = require("express");
const router =express.Router({mergeParams:true});
const ExpressError =require("../utils/ExpressError.js");
const wrapAsync =require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validatReview, isLoggedIn,isReviewOwner} = require("../Middleware.js");
const listingReview =require("../controllers/review.js");


//post reviews  Route;
router.post("/", isLoggedIn, validatReview, wrapAsync(listingReview.createReview));

// Delete Review Route

router.delete("/:reviewId",isLoggedIn,isReviewOwner, wrapAsync(listingReview.destroyReview));

module.exports =router;