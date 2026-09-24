// 1. Load .env file
require("dotenv").config();

// 2. Imports
const express = require("express");
const cors = require("cors");
const path = require("path");

// 3. Routes
const authRoutes = require("./routes/authRoutes");
const policyRoutes = require("./routes/policyRoutes");
const userPolicyRoutes = require("./routes/userPolicyRoutes");
const claimRoutes = require("./routes/claimRoutes");
const adminClaimRoutes = require("./routes/adminClaimRoutes");
const adminRoutes = require("./routes/adminRoutes");

// 4. Create Express server
const insuranceClaimServer = express();

// 5. Middleware
insuranceClaimServer.use(cors());
insuranceClaimServer.use(express.json());

// ======================================================
// SERVE UPLOADED DOCUMENTS
// ======================================================

insuranceClaimServer.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ======================================================
// API ROUTES
// ======================================================

insuranceClaimServer.use("/api/auth", authRoutes);
insuranceClaimServer.use("/api/policies", policyRoutes);
insuranceClaimServer.use("/api/user-policies", userPolicyRoutes);
insuranceClaimServer.use("/api/claims", claimRoutes);
insuranceClaimServer.use("/api/admin/claims", adminClaimRoutes);
insuranceClaimServer.use("/api/admin", adminRoutes);

// ======================================================
// DATABASE
// ======================================================

const connectDB = require("./config/db");
connectDB();

// ======================================================
// HOME
// ======================================================

insuranceClaimServer.get("/", (req, res) => {
  res
    .status(200)
    .send(
      `<h1 style="color:red">insurance-server started running...</h1>`
    );
});

// ======================================================
// PORT
// ======================================================

const PORT = process.env.PORT || 3000;

insuranceClaimServer.listen(PORT, () => {
  console.log(
    `insurance-server started running at PORT ${PORT}`
  );
});
