const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.renderNewForm = (req ,res)=>{
    res.render("listings/new.ejs")
};

// module.exports.index = async(req,res,next)=>{
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", {allListings})
// };









module.exports.index = async (req, res, next) => {
  try {
    const { search } = req.query;
    let allListings;

    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i"); // case insensitive
      allListings = await Listing.find({
        $or: [
          { title: regex },
          { location: regex }
        ]
      });
    } else {
      allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
    
  } catch (err) {
    next(err);
  }
};












module.exports.createListing = async (req, res, next) => {

     let response = await geocodingClient.forwardGeocode({
     query:req.body.listing.location,
     limit: 1
      })
       .send()

  
    let url =req.file.path;
    let filename =req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner =req.user._id; //for adding user name when i add new listing in out ppp
    newListing.image ={url,filename}
    newListing.geometry = response.body.features[0].geometry;
    let savelist = await newListing.save();
    console.log(savelist)
    req.flash("success" ,"New Listing Created!");
    res.redirect("/listings");
} ;

module.exports.showListing = async(req,res,next) =>{
    let {id} =req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    },}).populate("owner");
    if(!listing){
    req.flash("warning" ,"Listing you requested for does not exit!")
    return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.editListing =  async(req ,res,next) =>{
    let{id} = req.params;
    const listing =await Listing.findById(id);
    if(!listing){
         req.flash("warning" ,"Listing you requested for does not exit!")
         return res.redirect("/listings")
    }
    res.render("listings/edit.ejs" , {listing ,})
};

module.exports.updateListing = async (req, res,next) => {
    if (!req.body || !req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing"); }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    if( typeof req.file !=="undefined"){
    let url =req.file.path;
    let filename =req.file.filename;
    listing.image ={url,filename}
    await listing.save();
    }
    req.flash("success" ,"Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};
module.exports.deleteListing =async(req,res,next) =>{
    let {id} =req.params;
    let deleteListing= await Listing.findByIdAndDelete(id);
     console.log(deleteListing);
     req.flash("danger" ,"Listing Deleted Successfully");
     res.redirect("/listings");
};