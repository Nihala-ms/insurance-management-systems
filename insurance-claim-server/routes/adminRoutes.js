const express = require("express");
const router = express.Router();

const UserPolicy = require("../models/userPolicy");
const User = require("../models/user");
const Policy = require("../models/policy");
const Claim = require("../models/claim");

// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get("/dashboard", async (req, res) => {
  try {
    // -------------------------------------------------
    // TOTAL USERS
    // Only normal users
    // -------------------------------------------------

    const totalUsers = await User.countDocuments({
      role: "user",
    });

    // -------------------------------------------------
    // TOTAL POLICIES
    // -------------------------------------------------

    const totalPolicies = await Policy.countDocuments();

    // -------------------------------------------------
    // TOTAL POLICY APPLICATIONS
    // -------------------------------------------------

    const totalApplications =
      await UserPolicy.countDocuments();

    // -------------------------------------------------
    // PENDING POLICY APPLICATIONS
    // -------------------------------------------------

    const pendingApplications =
      await UserPolicy.countDocuments({
        status: "Pending",
      });

    // -------------------------------------------------
    // TOTAL CLAIMS
    // -------------------------------------------------

    const totalClaims = await Claim.countDocuments();

    // -------------------------------------------------
    // PENDING CLAIMS
    // -------------------------------------------------

    const pendingClaims = await Claim.countDocuments({
      status: {
        $regex: /^pending$/i,
      },
    });

    // -------------------------------------------------
    // LATEST 2 REGISTERED USERS
    // -------------------------------------------------

    const recentUsers = await User.find({
      role: "user",
    })
      .sort({ createdAt: -1 })
      .limit(2)
      .select("-password");

    // -------------------------------------------------
    // LATEST 2 POLICIES
    // -------------------------------------------------

    const recentPolicies = await Policy.find()
      .sort({
        updatedAt: -1,
        createdAt: -1,
      })
      .limit(2);

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.status(200).json({
      totalUsers,
      totalPolicies,

      totalApplications,
      pendingApplications,

      totalClaims,
      pendingClaims,

      recentUsers,
      recentPolicies,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch admin statistics",
      error: error.message,
    });
  }
});

// =====================================================
// ADMIN REPORTS
// =====================================================

router.get("/reports", async (req, res) => {
  try {
    // =================================================
    // USERS
    // =================================================

    const totalUsers = await User.countDocuments({
      role: "user",
    });

    // =================================================
    // POLICIES
    // =================================================

    const totalPolicies = await Policy.countDocuments();

    // =================================================
    // POLICY APPLICATIONS
    // =================================================

    const totalApplications =
      await UserPolicy.countDocuments();

    // Pending applications
    const pendingApplications =
      await UserPolicy.countDocuments({
        status: "Pending",
      });

    // Active = Approved application
    const approvedApplications =
      await UserPolicy.countDocuments({
        status: "Active",
      });

    // Rejected applications
    const rejectedApplications =
      await UserPolicy.countDocuments({
        status: "Rejected",
      });

    // =================================================
    // CLAIMS
    // =================================================

    const totalClaims = await Claim.countDocuments();

    const pendingClaims = await Claim.countDocuments({
      status: {
        $regex: /^pending$/i,
      },
    });

    const approvedClaims = await Claim.countDocuments({
      status: {
        $regex: /^approved$/i,
      },
    });

    const rejectedClaims = await Claim.countDocuments({
      status: {
        $regex: /^rejected$/i,
      },
    });

    // =================================================
    // DEBUG
    // =================================================

    console.log("================================");
    console.log("ADMIN REPORTS");

    console.log("Users:", totalUsers);
    console.log("Policies:", totalPolicies);

    console.log("Applications:", totalApplications);
    console.log(
      "Pending Applications:",
      pendingApplications
    );
    console.log(
      "Approved/Active Applications:",
      approvedApplications
    );
    console.log(
      "Rejected Applications:",
      rejectedApplications
    );

    console.log("Claims:", totalClaims);
    console.log("Pending Claims:", pendingClaims);
    console.log("Approved Claims:", approvedClaims);
    console.log("Rejected Claims:", rejectedClaims);

    console.log("================================");

    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      totalUsers,
      totalPolicies,

      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,

      totalClaims,
      pendingClaims,
      approvedClaims,
      rejectedClaims,
    });
  } catch (error) {
    console.error("ADMIN REPORTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch admin reports",
      error: error.message,
    });
  }
});

// =====================================================
// EXPORT
// =====================================================

module.exports = router;