const Listing =require("./models/listing");
const Review =require("./models/review");
const ExpressError =require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl =req.originalUrl;
      req.flash("error" ,"You must be logged into create listing");
       return res.redirect("/login");
    }
    next();

};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner =async(req,res,next)=>{
     let { id } = req.params;
    let listing = await Listing.findById(id);
     if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" ,"You don't have permission to edit")
        return res.redirect(`/listings/${id}`)
     }
     next();
}




module.exports.validateListing = (req, res, next) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Listing data is required");
    }

    const { error } = listingSchema.validate(req.body);

    if (error) {
        let errormsg = error.details.map((el) => el.message).join(",");

        throw new ExpressError(400, errormsg);
    }
 
    next();
};


module.exports.validatReview = (req, res, next) => {
    if (!req.body.review) {
        throw new ExpressError(400, "Review data is required");
    }

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let errormsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errormsg);
    }

    next();
};



module.exports.isReviewOwner =async(req,res,next)=>{
     let {id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" ,"You don't have permission to delete this Review")
        return res.redirect(`/listings/${id}`)
     }
     next();
}