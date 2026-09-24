const express = require("express");
const multer = require("multer");

const Claim = require("../models/claim");
const UserPolicy = require("../models/userPolicy");

const router = express.Router();

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG, and PDF files are allowed"
        )
      );
    }
  },
});

// =====================================================
// SUBMIT CLAIM
// =====================================================

router.post(
  "/",
  upload.array("documents", 5),
  async (req, res) => {
    try {
const {
  userId,
  userPolicyId,
  claimType,
  incidentDate,
  incidentLocation,
  contactNumber,
  description,
  claimAmount,

  // Vehicle
  vehicleNumber,
  vehicleDamage,

  // Health
  hospitalName,
  treatmentDetails,
  admissionDate,
  dischargeDate,
} = req.body;
      // -------------------------------------------------
      // VALIDATE USER POLICY
      // -------------------------------------------------

      const userPolicy = await UserPolicy.findOne({
        _id: userPolicyId,
        user: userId,
        status: "Active",
      });

      if (!userPolicy) {
        return res.status(400).json({
          message: "Invalid or inactive insurance policy",
        });
      }

      // -------------------------------------------------
      // GENERATE CLAIM NUMBER
      // -------------------------------------------------

      const claimNumber = "CLM-" + Date.now();

      // -------------------------------------------------
      // DOCUMENTS
      // -------------------------------------------------

      const documents = (req.files || []).map((file) => ({
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
      }));

      // -------------------------------------------------
      // CREATE CLAIM
      // -------------------------------------------------

const claim = await Claim.create({
  user: userId,
  userPolicy: userPolicyId,
  claimNumber,
  claimType,

  // Common
  incidentDate,
  incidentLocation: incidentLocation || "",
  contactNumber,
  description,
  claimAmount: Number(claimAmount),

  // Vehicle
  vehicleNumber: vehicleNumber || "",
  vehicleDamage: vehicleDamage || "",

  // Health
  hospitalName: hospitalName || "",
  treatmentDetails: treatmentDetails || "",
  admissionDate: admissionDate
    ? new Date(admissionDate)
    : undefined,
  dischargeDate: dischargeDate
    ? new Date(dischargeDate)
    : undefined,

  documents,
  status: "Pending",
});
      // -------------------------------------------------
      // RETURN POPULATED CLAIM
      // -------------------------------------------------

      const populatedClaim = await Claim.findById(claim._id)
        .populate("user", "name fullName email")
        .populate({
          path: "userPolicy",
          populate: {
            path: "policy",
          },
        });

      res.status(201).json({
        message: "Claim submitted successfully",
        claim: populatedClaim,
      });
    } catch (error) {
      console.error("CLAIM ERROR:", error);

      res.status(500).json({
        message: "Failed to submit claim",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET ALL CLAIMS - ADMIN DASHBOARD
// =====================================================

router.get("/", async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("user", "name fullName email")
      .populate({
        path: "userPolicy",
        populate: {
          path: "policy",
        },
      })
      .sort({
        createdAt: -1,
      });

    res.status(200).json(claims);
  } catch (error) {
    console.error("GET ALL CLAIMS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch all claims",
      error: error.message,
    });
  }
});

// =====================================================
// GET USER'S CLAIMS
// =====================================================

router.get(
  "/user/:userId",
  async (req, res) => {
    try {
      const claims = await Claim.find({
        user: req.params.userId,
      })
        .populate({
          path: "userPolicy",
          populate: {
            path: "policy",
          },
        })
        .sort({
          createdAt: -1,
        });

      res.status(200).json(claims);
    } catch (error) {
      console.error("GET USER CLAIMS ERROR:", error);

      res.status(500).json({
        message: "Failed to fetch claims",
        error: error.message,
      });
    }
  }
);

// =====================================================
// UPDATE CLAIM STATUS - ADMIN
// =====================================================

router.put(
  "/:claimId/status",
  async (req, res) => {
    try {
      const { claimId } = req.params;

      const {
        status,
        adminRemarks,
      } = req.body;

      // -------------------------------------------------
      // VALIDATE STATUS
      // -------------------------------------------------

      const allowedStatuses = [
        "Pending",
        "Under Review",
        "Approved",
        "Rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid claim status",
        });
      }

      // -------------------------------------------------
      // FIND CLAIM
      // -------------------------------------------------

      const claim = await Claim.findById(claimId);

      if (!claim) {
        return res.status(404).json({
          message: "Claim not found",
        });
      }

      // -------------------------------------------------
      // UPDATE
      // -------------------------------------------------

      claim.status = status;

      if (adminRemarks !== undefined) {
        claim.adminRemarks = adminRemarks;
      }

      await claim.save();

      // -------------------------------------------------
      // RETURN UPDATED CLAIM
      // -------------------------------------------------

      const updatedClaim = await Claim.findById(claim._id)
        .populate("user", "name fullName email")
        .populate({
          path: "userPolicy",
          populate: {
            path: "policy",
          },
        });

      res.status(200).json({
        message: "Claim status updated successfully",
        claim: updatedClaim,
      });
    } catch (error) {
      console.error(
        "UPDATE CLAIM STATUS ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to update claim status",
        error: error.message,
      });
    }
  }
);

module.exports = router;