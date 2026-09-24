const mongoose = require("mongoose");

const userPolicySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: true,
    },

    // Original policy number
    basePolicyNumber: {
      type: String,
    },

    // Unique number for each user's purchased/application policy
    policyNumber: {
      type: String,
      required: true,
      unique: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Active",
        "Rejected",
        "Expired",
        "Cancelled",
      ],
      default: "Pending",
    },

    // Admin's approval/rejection message
    adminRemarks: {
      type: String,
      default: "",
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    personalDetails: {
      fullName: {
        type: String,
        required: true,
      },

      dateOfBirth: {
        type: Date,
        required: true,
      },

      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },
    },

    vehicleDetails: {
      vehicleNumber: String,
      vehicleType: String,
      vehicleModel: String,
      vehicleYear: String,
    },

    healthDetails: {
      medicalHistory: String,
      existingDiseases: String,
      smoker: String,
      alcohol: String,
    },

    homeDetails: {
      propertyType: String,
      propertyAddress: String,
      propertyValue: String,
    },

    lifeDetails: {
      nomineeName: String,
      nomineeRelation: String,
      occupation: String,
      annualIncome: String,
    },

    documents: {
      idProof: String,
      addressProof: String,
      medicalReport: String,
      vehicleDocument: String,
      propertyDocument: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.UserPolicy ||
  mongoose.model("UserPolicy", userPolicySchema);