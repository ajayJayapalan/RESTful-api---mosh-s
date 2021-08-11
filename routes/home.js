const express = require('express')
const router = express.Router();

// GET method
router.get("/", (req, res) => {
    res.send("welcome home");
  });

module.exports = router;