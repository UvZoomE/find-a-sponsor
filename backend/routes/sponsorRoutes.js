// backend/routes/sponsorRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSponsors,
  createSponsor,
} = require("../controllers/sponsorController");

router.route("/").get(getSponsors).post(createSponsor);

module.exports = router;
