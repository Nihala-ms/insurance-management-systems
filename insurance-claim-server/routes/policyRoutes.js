const express = require("express");
const Policy = require("../models/Policy");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const policies = await Policy.find({
      status: "Active",
    });

    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch policies",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      policyName,
      policyType,
      description,
      coverageAmount,
      premiumAmount,
      duration,
    } = req.body;

    // Generate unique policy number
    const policyNumber =
      "POL-" +
      Date.now().toString().slice(-8);

    const policy = await Policy.create({
      policyName,
      policyNumber,
      policyType,
      description,
      coverageAmount,
      premiumAmount,
      duration,
    });

    res.status(201).json(policy);

  } catch (error) {
    console.error("CREATE POLICY ERROR:", error);

    res.status(500).json({
      message: "Failed to create policy",
      error: error.message,
    });
  }
});

// UPDATE POLICY
router.put("/:id", async (req, res) => {
  try {
    const {
      policyName,
      policyType,
      description,
      coverageAmount,
      premiumAmount,
      duration,
    } = req.body;

    const updatedPolicy = await Policy.findByIdAndUpdate(
      req.params.id,
      {
        policyName,
        policyType,
        description,
        coverageAmount,
        premiumAmount,
        duration,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPolicy) {
      return res.status(404).json({
        message: "Policy not found",
      });
    }

    res.status(200).json(updatedPolicy);

  } catch (error) {
    console.error("UPDATE POLICY ERROR:", error);

    res.status(500).json({
      message: "Failed to update policy",
      error: error.message,
    });
  }
});

// ACTIVATE / DEACTIVATE POLICY
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid policy status",
      });
    }

    const updatedPolicy = await Policy.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPolicy) {
      return res.status(404).json({
        message: "Policy not found",
      });
    }

    res.status(200).json(updatedPolicy);

  } catch (error) {
    console.error("UPDATE POLICY STATUS ERROR:", error);

    res.status(500).json({
      message: "Failed to update policy status",
      error: error.message,
    });
  }
});

module.exports = router;