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

module.exports = router;