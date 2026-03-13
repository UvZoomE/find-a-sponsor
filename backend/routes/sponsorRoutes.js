// backend/routes/sponsorRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} = require("../controllers/sponsorController");

router.route("/").get(getSponsors).post(createSponsor);

// Add the two new routes that expect an ID parameter at the end of the URL
router.put('/:id', updateSponsor);
router.delete('/:id', deleteSponsor);

module.exports = router;
