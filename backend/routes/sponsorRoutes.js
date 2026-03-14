// backend/routes/sponsorRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
} = require("../controllers/sponsorController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getSponsors).post(createSponsor);

// Add the two new routes that expect an ID parameter at the end of the URL
router.put("/:id", protect, updateSponsor);
router.delete("/:id", protect, deleteSponsor);

module.exports = router;
