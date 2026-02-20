if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride =require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError =require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport =require("passport");
const LocalStrategy =require("passport-local");
const User = require("./models/user.js");
const pagesRoutes = require("./routes/page.js");


const listingrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js");
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine", "ejs");
app.set("views" ,path.join(__dirname ,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


const dburl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error", function(error) {
    console.log("Session Store Error:", error);
});

app.set("trust proxy", 1); 
const sessionOption = {

    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
     store: store,
    cookie:{
        expires: Date.now() +7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly: true,
       secure:true
    },
};



app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
     res.locals.danger = req.flash("danger");
       res.locals.error = req.flash("error");
        res.locals.currUser = req.user;
    next();
});




main()
.then( ()=>{
    console.log("Connected to DB")
}).catch((err) =>{
    console.log(err)
});

async function main() {
    await mongoose.connect(dburl);
}

app.use("/listings", listingrouter);
app.use("/listings/:id/reviews",reviewrouter);
app.use("/",userrouter);
app.use("/", pagesRoutes);


// 👇 ADD THIS EXACTLY HERE
app.get("/", (req, res) => {
    res.redirect("/listings");
});



app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});
// middlewares

app.use((err,req,res,next)=>{
    let {statusCode=500 ,message="something went wrong!"} =err;
    res.status(statusCode).render("listings/error.ejs" ,{message});
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});