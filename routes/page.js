const express = require("express");
const router = express.Router();

// Privacy page
router.get("/privacy", (req, res) => {
    res.render("./pages/privacy");
});

// Terms page
router.get("/terms", (req, res) => {
    res.render("./pages/terms");
});


router.get("/trending", (req, res) => {
    res.render("./pages/trending.ejs");
});
router.get("/room", (req, res) => {
    res.render("./pages/rooms.ejs");
});

module.exports = router;