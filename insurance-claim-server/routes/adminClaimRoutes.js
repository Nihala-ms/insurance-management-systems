const express = require("express");
const Claim = require("../models/claim");

const router = express.Router();


// Get all claims
router.get("/", async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("user", "fullName email")
      .populate({
        path: "userPolicy",
        populate: {
          path: "policy",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(claims);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all claims",
      error: error.message,
    });
  }
});


// Update claim status
router.put("/:claimId/status", async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    const claim = await Claim.findByIdAndUpdate(
      req.params.claimId,

      {
        status,
        adminRemarks,
      },

      {
        new: true,
        runValidators: true,
      }
    );

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    res.status(200).json({
      message: "Claim status updated successfully",
      claim,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update claim status",
      error: error.message,
    });
  }
});


module.exports = router;