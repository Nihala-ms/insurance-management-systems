const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UserPolicy = require("../models/userPolicy");
const Policy = require("../models/policy");
const User = require("../models/user");


// ======================================================
// FILE UPLOAD CONFIGURATION
// ======================================================

const uploadDirectory = path.join(
  __dirname,
  "../uploads"
);

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// =====================================================
// CREATE POLICY APPLICATION
// =====================================================

router.post(
  "/",
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "medicalCertificate", maxCount: 1 },
    { name: "vehicleDocument", maxCount: 1 },
    { name: "otherDocument", maxCount: 1 },
  ]),
  async (req, res) => {
      try {
const {
  userId,
  policyId,
  policyNumber,
  startDate,
  endDate,
} = req.body;

const personalDetails =
  req.body.personalDetails
    ? JSON.parse(req.body.personalDetails)
    : {};

const vehicleDetails =
  req.body.vehicleDetails
    ? JSON.parse(req.body.vehicleDetails)
    : {};

const healthDetails =
  req.body.healthDetails
    ? JSON.parse(req.body.healthDetails)
    : {};

const homeDetails =
  req.body.homeDetails
    ? JSON.parse(req.body.homeDetails)
    : {};

const lifeDetails =
  req.body.lifeDetails
    ? JSON.parse(req.body.lifeDetails)
    : {};

const documents = {
  idProof:
    req.files?.idProof?.[0]
      ? `/uploads/${req.files.idProof[0].filename}`
      : "",

  addressProof:
    req.files?.addressProof?.[0]
      ? `/uploads/${req.files.addressProof[0].filename}`
      : "",

  medicalReport:
    req.files?.medicalCertificate?.[0]
      ? `/uploads/${req.files.medicalCertificate[0].filename}`
      : "",

  vehicleDocument:
    req.files?.vehicleDocument?.[0]
      ? `/uploads/${req.files.vehicleDocument[0].filename}`
      : "",

  propertyDocument:
    req.files?.otherDocument?.[0]
      ? `/uploads/${req.files.otherDocument[0].filename}`
      : "",
};    
    // Validate user
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // Validate policy
    if (!policyId) {
      return res.status(400).json({
        message: "Policy ID is required",
      });
    }

    // Validate personal details
    if (
      !personalDetails ||
      !personalDetails.fullName ||
      !personalDetails.dateOfBirth ||
      !personalDetails.gender ||
      !personalDetails.phone ||
      !personalDetails.email ||
      !personalDetails.address
    ) {
      return res.status(400).json({
        message: "All personal details are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const policy = await Policy.findById(policyId);

    if (!policy) {
      return res.status(404).json({
        message: "Policy not found",
      });
    }

    // Check if user already has an active/pending application
    const existingApplication = await UserPolicy.findOne({
      user: userId,
      policy: policyId,
      status: {
        $in: ["Pending", "Active"],
      },
    });

    if (existingApplication) {
      return res.status(400).json({
        message:
          "You already have a pending or active application for this policy.",
      });
    }

    // Generate unique purchased policy number
    const purchasedPolicyNumber =
      "UP-" +
      Date.now().toString() +
      "-" +
      Math.floor(Math.random() * 1000);

    const userPolicy = new UserPolicy({
      user: userId,

      policy: policyId,

      basePolicyNumber: policyNumber || policy.policyNumber,

      policyNumber: purchasedPolicyNumber,

      startDate: startDate || new Date(),

      endDate,

      // IMPORTANT
      // New application starts as Pending
      status: "Pending",

      adminRemarks: "",

      personalDetails,

      vehicleDetails:
        policy.policyType === "Vehicle"
          ? vehicleDetails
          : undefined,

      healthDetails:
        policy.policyType === "Health"
          ? healthDetails
          : undefined,

      homeDetails:
        policy.policyType === "Home"
          ? homeDetails
          : undefined,

      lifeDetails:
        policy.policyType === "Life"
          ? lifeDetails
          : undefined,

      documents: documents || {},
    });

    await userPolicy.save();

    const populatedPolicy = await UserPolicy.findById(
      userPolicy._id
    )
      .populate("user", "name email")
      .populate("policy");

    res.status(201).json({
      message:
        "Policy application submitted successfully. Waiting for admin approval.",
      userPolicy: populatedPolicy,
    });
  } catch (error) {
    console.error("ADD USER POLICY ERROR:", error);

    res.status(500).json({
      message: "Failed to submit policy application",
      error: error.message,
    });
  }
});

// =====================================================
// GET ALL USER POLICIES - ADMIN
// =====================================================

router.get("/", async (req, res) => {
  try {
    const userPolicies = await UserPolicy.find()
      .populate("user", "name email")
      .populate("policy")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(userPolicies);
  } catch (error) {
    console.error("GET ALL USER POLICIES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch user policies",
      error: error.message,
    });
  }
});

// =====================================================
// GET SINGLE USER POLICY DETAILS
// IMPORTANT: KEEP THIS BEFORE /:userId
// =====================================================

router.get("/details/:id", async (req, res) => {
  try {
    const userPolicy = await UserPolicy.findById(req.params.id)
      .populate("user", "name email")
      .populate("policy")
      .populate("reviewedBy", "name email");

    if (!userPolicy) {
      return res.status(404).json({
        message: "Policy application not found",
      });
    }

    res.status(200).json(userPolicy);
  } catch (error) {
    console.error("GET USER POLICY DETAILS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch policy details",
      error: error.message,
    });
  }
});

// =====================================================
// GET USER'S POLICIES
// =====================================================

router.get("/:userId", async (req, res) => {
  try {
    const userPolicies = await UserPolicy.find({
      user: req.params.userId,
    })
      .populate("policy")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(userPolicies);
  } catch (error) {
    console.error("GET USER POLICIES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch user policies",
      error: error.message,
    });
  }
});

// =====================================================
// ADMIN APPROVE / REJECT POLICY
// =====================================================

router.put("/:id/status", async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    if (!["Active", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Active or Rejected",
      });
    }

    const userPolicy = await UserPolicy.findById(req.params.id);

    if (!userPolicy) {
      return res.status(404).json({
        message: "Policy application not found",
      });
    }

    // Only pending applications should normally be reviewed
    if (userPolicy.status !== "Pending") {
      return res.status(400).json({
        message: `This application is already ${userPolicy.status}.`,
      });
    }

    // Rejection should have a reason
    if (
      status === "Rejected" &&
      (!adminRemarks || !adminRemarks.trim())
    ) {
      return res.status(400).json({
        message: "Please provide a rejection reason.",
      });
    }

    userPolicy.status = status;

    userPolicy.adminRemarks =
      adminRemarks?.trim() || "";

    userPolicy.reviewedAt = new Date();

    // If you have admin authentication,
    // replace this with req.user._id
    //
    // userPolicy.reviewedBy = req.user._id;

    await userPolicy.save();

    const updatedPolicy = await UserPolicy.findById(
      userPolicy._id
    )
      .populate("user", "name email")
      .populate("policy")
      .populate("reviewedBy", "name email");

    res.status(200).json({
      message:
        status === "Active"
          ? "Policy approved successfully."
          : "Policy rejected successfully.",

      userPolicy: updatedPolicy,
    });
  } catch (error) {
    console.error("UPDATE USER POLICY STATUS ERROR:", error);

    res.status(500).json({
      message: "Failed to update policy status",
      error: error.message,
    });
  }
});

module.exports = router;