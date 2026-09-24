const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userPolicy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserPolicy",
      required: true,
    },

    claimNumber: {
      type: String,
      required: true,
      unique: true,
    },

    claimType: {
      type: String,
      required: true,
    },

    // Vehicle insurance fields
    vehicleNumber: {
      type: String,
      default: "",
    },

    vehicleDamage: {
      type: String,
      default: "",
    },

    // Health insurance fields
    hospitalName: {
      type: String,
      default: "",
    },

    treatmentDetails: {
      type: String,
      default: "",
    },

    admissionDate: {
      type: Date,
    },

    dischargeDate: {
      type: Date,
    },

    incidentDate: {
      type: Date,
      required: true,
    },

    // Not required for health claims
    incidentLocation: {
      type: String,
      default: "",
    },

    contactNumber: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    claimAmount: {
      type: Number,
      required: true,
    },

    documents: [
      {
        fileName: String,
        fileType: String,
        fileSize: Number,
      },
    ],

    status: {
      type: String,
      enum: [
        "Pending",
        "Under Review",
        "Approved",
        "Rejected",
      ],
      default: "Pending",
    },

    adminRemarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Claim =
  mongoose.models.Claim ||
  mongoose.model("Claim", claimSchema);

module.exports = Claim;