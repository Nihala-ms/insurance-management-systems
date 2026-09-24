import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addUserPolicy } from "../../services/api";

function PolicyDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const policy = location.state?.policy;

  const [user, setUser] = useState(null);

  const [activeStep, setActiveStep] = useState(1);

  const [loading, setLoading] = useState(false);

  // ======================================================
  // PERSONAL DETAILS
  // ======================================================

  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  // ======================================================
  // VEHICLE DETAILS
  // ======================================================

  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleType: "",
    vehicleNumber: "",
    registrationNumber: "",
    model: "",
    manufacturer: "",
    year: "",
  });

  // ======================================================
  // HEALTH DETAILS
  // ======================================================

  const [healthDetails, setHealthDetails] = useState({
    bloodGroup: "",
    height: "",
    weight: "",
    existingDisease: "",
    medicalHistory: "",
  });

  // ======================================================
  // HOME DETAILS
  // ======================================================

  const [homeDetails, setHomeDetails] = useState({
    propertyType: "",
    propertyAddress: "",
    propertyValue: "",
    yearBuilt: "",
  });

  // ======================================================
  // LIFE DETAILS
  // ======================================================

  const [lifeDetails, setLifeDetails] = useState({
    nomineeName: "",
    nomineeRelation: "",
    nomineePhone: "",
  });

  // ======================================================
  // DOCUMENTS
  // ======================================================

  const [documents, setDocuments] = useState({
    idProof: null,
    addressProof: null,
    medicalCertificate: null,
    vehicleDocument: null,
    otherDocument: null,
  });

  // ======================================================
  // LOAD USER
  // ======================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login to continue.");
      navigate("/Auth");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      // Pre-fill email if available
      setPersonalDetails((prev) => ({
        ...prev,
        email: parsedUser?.email || "",
      }));
    } catch (error) {
      console.error("USER DATA ERROR:", error);

      localStorage.removeItem("user");

      alert("Please login again.");
      navigate("/login");
    }
  }, [navigate]);

  // ======================================================
  // CHECK POLICY
  // ======================================================

  useEffect(() => {
    if (!policy) {
      alert("Policy information not found.");
      navigate("/policies");
    }
  }, [policy, navigate]);

  // ======================================================
  // PERSONAL DETAILS CHANGE
  // ======================================================

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;

    setPersonalDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // VEHICLE DETAILS CHANGE
  // ======================================================

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;

    setVehicleDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // HEALTH DETAILS CHANGE
  // ======================================================

  const handleHealthChange = (e) => {
    const { name, value } = e.target;

    setHealthDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // HOME DETAILS CHANGE
  // ======================================================

  const handleHomeChange = (e) => {
    const { name, value } = e.target;

    setHomeDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // LIFE DETAILS CHANGE
  // ======================================================

  const handleLifeChange = (e) => {
    const { name, value } = e.target;

    setLifeDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // DOCUMENT CHANGE
  // ======================================================

  const handleDocumentChange = (e) => {
    const { name, files } = e.target;

    setDocuments((prev) => ({
      ...prev,
      [name]: files?.[0] || null,
    }));
  };

  // ======================================================
  // VALIDATE PERSONAL DETAILS
  // ======================================================

  const validatePersonalDetails = () => {
    if (!personalDetails.fullName.trim()) {
      alert("Please enter your full name.");
      return false;
    }

    if (!personalDetails.dateOfBirth) {
      alert("Please enter your date of birth.");
      return false;
    }

    if (!personalDetails.gender) {
      alert("Please select your gender.");
      return false;
    }

    if (!personalDetails.phone.trim()) {
      alert("Please enter your phone number.");
      return false;
    }

    if (!personalDetails.email.trim()) {
      alert("Please enter your email.");
      return false;
    }

    if (!personalDetails.address.trim()) {
      alert("Please enter your address.");
      return false;
    }

    return true;
  };

  // ======================================================
  // VALIDATE TYPE-SPECIFIC DETAILS
  // ======================================================

  const validatePolicyDetails = () => {
    // -------------------------
    // Vehicle
    // -------------------------

    if (policy?.policyType === "Vehicle") {
      if (!vehicleDetails.vehicleType.trim()) {
        alert("Please enter the vehicle type.");
        return false;
      }

      if (!vehicleDetails.vehicleNumber.trim()) {
        alert("Please enter the vehicle number.");
        return false;
      }

      if (!vehicleDetails.model.trim()) {
        alert("Please enter the vehicle model.");
        return false;
      }
    }

    // -------------------------
    // Health
    // -------------------------

    if (policy?.policyType === "Health") {
      if (!healthDetails.bloodGroup.trim()) {
        alert("Please enter your blood group.");
        return false;
      }

      if (!healthDetails.height.trim()) {
        alert("Please enter your height.");
        return false;
      }

      if (!healthDetails.weight.trim()) {
        alert("Please enter your weight.");
        return false;
      }
    }

    // -------------------------
    // Home
    // -------------------------

    if (policy?.policyType === "Home") {
      if (!homeDetails.propertyType.trim()) {
        alert("Please select the property type.");
        return false;
      }

      if (!homeDetails.propertyAddress.trim()) {
        alert("Please enter the property address.");
        return false;
      }

      if (!homeDetails.propertyValue.trim()) {
        alert("Please enter the property value.");
        return false;
      }
    }

    // -------------------------
    // Life
    // -------------------------

    if (policy?.policyType === "Life") {
      if (!lifeDetails.nomineeName.trim()) {
        alert("Please enter nominee name.");
        return false;
      }

      if (!lifeDetails.nomineeRelation.trim()) {
        alert("Please enter nominee relationship.");
        return false;
      }

      if (!lifeDetails.nomineePhone.trim()) {
        alert("Please enter nominee phone number.");
        return false;
      }
    }

    return true;
  };

  // ======================================================
  // CONTINUE
  // ======================================================

  const handleContinue = () => {
    if (activeStep === 1) {
      if (!validatePersonalDetails()) {
        return;
      }
    }

    if (activeStep === 2) {
      if (!validatePolicyDetails()) {
        return;
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  // ======================================================
  // GO BACK
  // ======================================================

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  // ======================================================
  // SUBMIT POLICY APPLICATION
  // ======================================================

  const handleSubmitPolicy = async () => {
    try {
      if (!user) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      // -------------------------
      // Get user ID
      // -------------------------

      const userId = user?.id || user?._id;

      if (!userId) {
        alert(
          "User information is missing. Please login again."
        );
        return;
      }

      // -------------------------
      // Validate
      // -------------------------

      if (!validatePersonalDetails()) {
        setActiveStep(1);
        return;
      }

      if (!validatePolicyDetails()) {
        setActiveStep(2);
        return;
      }

      if (!policy?._id) {
        alert("Policy information is missing.");
        return;
      }

      setLoading(true);

      // -------------------------
      // Calculate dates
      // -------------------------

      const startDate = new Date();

      const endDate = new Date(startDate);

      const duration =
        Number(policy?.duration) || 1;

      endDate.setFullYear(
        endDate.getFullYear() + duration
      );

      // -------------------------
      // Format documents
      // -------------------------

const formattedDocuments = {
  idProof: documents.idProof,
  addressProof: documents.addressProof,
  medicalCertificate: documents.medicalCertificate,
  vehicleDocument: documents.vehicleDocument,
  otherDocument: documents.otherDocument,
};
      // -------------------------
      // Policy application data
      // -------------------------

      const policyData = {
        userId,

        policyId: policy._id,

        policyNumber:
          policy.policyNumber || "",

        startDate,

        endDate,

        personalDetails: {
          fullName:
            personalDetails.fullName.trim(),

          dateOfBirth:
            personalDetails.dateOfBirth,

          gender:
            personalDetails.gender,

          phone:
            personalDetails.phone.trim(),

          email:
            personalDetails.email.trim(),

          address:
            personalDetails.address.trim(),
        },

        vehicleDetails:
          policy.policyType === "Vehicle"
            ? vehicleDetails
            : {},

        healthDetails:
          policy.policyType === "Health"
            ? healthDetails
            : {},

        homeDetails:
          policy.policyType === "Home"
            ? homeDetails
            : {},

        lifeDetails:
          policy.policyType === "Life"
            ? lifeDetails
            : {},

        documents:
          formattedDocuments,
      };

      // IMPORTANT:
      // We DO NOT send status here.
      //
      // Backend automatically creates:
      //
      // status = "Pending"
      //
      // Admin must approve the application
      // before it becomes Active.

      console.log(
        "SUBMITTING POLICY APPLICATION:",
        policyData
      );

      // -------------------------
      // API call
      // -------------------------

      const data =
        await addUserPolicy(policyData);

      console.log(
        "POLICY APPLICATION RESPONSE:",
        data
      );

      alert(
        data?.message ||
          "Insurance application submitted successfully. Waiting for admin approval."
      );

      // -------------------------
      // Go to dashboard
      // -------------------------

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "ADD POLICY ERROR:",
        error
      );

      alert(
        error?.message ||
          "Failed to submit insurance application."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // IF POLICY NOT FOUND
  // ======================================================

  if (!policy) {
    return null;
  }

  // ======================================================
  // STEP TITLE
  // ======================================================

  const getStepTitle = () => {
    if (activeStep === 1) {
      return "Personal Information";
    }

    if (activeStep === 2) {
      return `${policy.policyType || ""} Insurance Details`;
    }

    return "Documents";
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="border-b border-slate-800 bg-slate-900/80">

        <div className="max-w-6xl mx-auto px-6 py-5">

          <button
            onClick={() => navigate("/policies")}
            className="text-cyan-400 hover:text-cyan-300 text-sm mb-4"
          >
            ← Back to Policies
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Apply for Insurance
              </h1>

              <p className="text-slate-400 mt-1">
                {policy.policyName}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm text-slate-400">
                Policy Number
              </p>

              <p className="font-semibold text-cyan-400">
                {policy.policyNumber || "-"}
              </p>
            </div>

          </div>

        </div>

      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* ==================================================
            APPLICATION NOTICE
        ================================================== */}

        <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">

          <div className="flex gap-3">

            <div className="text-yellow-400 text-xl">
              !
            </div>

            <div>
              <h3 className="font-semibold text-yellow-300">
                Application Review
              </h3>

              <p className="text-sm text-yellow-200/70 mt-1">
                After submitting this application, it will
                be reviewed by an administrator. Your policy
                will become active only after admin approval.
              </p>
            </div>

          </div>

        </div>

        {/* ==================================================
            PROGRESS
        ================================================== */}

        <div className="mb-8">

          <div className="flex items-center justify-between">

            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>

                <div className="flex flex-col items-center">

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      activeStep >= step
                        ? "bg-cyan-500 text-slate-950"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {step}
                  </div>

                  <span className="text-xs text-slate-400 mt-2 text-center">
                    {step === 1
                      ? "Personal"
                      : step === 2
                      ? "Policy Details"
                      : "Documents"}
                  </span>

                </div>

                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-3 rounded ${
                      activeStep > step
                        ? "bg-cyan-500"
                        : "bg-slate-800"
                    }`}
                  />
                )}

              </React.Fragment>
            ))}

          </div>

        </div>

        {/* ==================================================
            POLICY SUMMARY
        ================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

          <h2 className="text-lg font-semibold mb-5">
            Selected Policy
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            <div>
              <p className="text-xs text-slate-500">
                Policy
              </p>

              <p className="mt-1 font-medium">
                {policy.policyName || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Type
              </p>

              <p className="mt-1 font-medium">
                {policy.policyType || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Coverage
              </p>

              <p className="mt-1 font-medium">
                ₹
                {policy.coverageAmount
                  ? Number(
                      policy.coverageAmount
                    ).toLocaleString()
                  : "0"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Premium
              </p>

              <p className="mt-1 font-medium">
                ₹
                {policy.premium
                  ? Number(
                      policy.premium
                    ).toLocaleString()
                  : "0"}
              </p>
            </div>

          </div>

        </section>

        {/* ==================================================
            FORM
        ================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="mb-6">

            <h2 className="text-xl font-semibold">
              {getStepTitle()}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Please provide accurate information for
              policy verification.
            </p>

          </div>

          {/* ==================================================
              STEP 1 - PERSONAL
          ================================================== */}

          {activeStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Input
                label="Full Name"
                name="fullName"
                value={
                  personalDetails.fullName
                }
                onChange={
                  handlePersonalChange
                }
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={
                  personalDetails.dateOfBirth
                }
                onChange={
                  handlePersonalChange
                }
                required
              />

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Gender *
                </label>

                <select
                  name="gender"
                  value={
                    personalDetails.gender
                  }
                  onChange={
                    handlePersonalChange
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={
                  personalDetails.phone
                }
                onChange={
                  handlePersonalChange
                }
                placeholder="Enter phone number"
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={
                  personalDetails.email
                }
                onChange={
                  handlePersonalChange
                }
                placeholder="Enter email address"
                required
              />

              <div className="md:col-span-2">

                <label className="block text-sm text-slate-300 mb-2">
                  Address *
                </label>

                <textarea
                  name="address"
                  value={
                    personalDetails.address
                  }
                  onChange={
                    handlePersonalChange
                  }
                  rows={4}
                  placeholder="Enter your complete address"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 resize-none"
                />

              </div>

            </div>
          )}

          {/* ==================================================
              STEP 2 - VEHICLE
          ================================================== */}

          {activeStep === 2 &&
            policy.policyType === "Vehicle" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Input
                  label="Vehicle Type"
                  name="vehicleType"
                  value={
                    vehicleDetails.vehicleType
                  }
                  onChange={
                    handleVehicleChange
                  }
                  placeholder="Car / Bike / Truck"
                  required
                />

                <Input
                  label="Vehicle Number"
                  name="vehicleNumber"
                  value={
                    vehicleDetails.vehicleNumber
                  }
                  onChange={
                    handleVehicleChange
                  }
                  placeholder="Enter vehicle number"
                  required
                />

                <Input
                  label="Registration Number"
                  name="registrationNumber"
                  value={
                    vehicleDetails.registrationNumber
                  }
                  onChange={
                    handleVehicleChange
                  }
                  placeholder="Enter registration number"
                />

                <Input
                  label="Vehicle Model"
                  name="model"
                  value={
                    vehicleDetails.model
                  }
                  onChange={
                    handleVehicleChange
                  }
                  placeholder="Enter vehicle model"
                  required
                />

                <Input
                  label="Manufacturer"
                  name="manufacturer"
                  value={
                    vehicleDetails.manufacturer
                  }
                  onChange={
                    handleVehicleChange
                  }
                  placeholder="Toyota / Honda / Hyundai..."
                />

                <Input
                  label="Year"
                  name="year"
                  value={
                    vehicleDetails.year
                  }
                  onChange={
                    handleVehicleChange
                  }
                  placeholder="2024"
                />

              </div>
            )}

          {/* ==================================================
              STEP 2 - HEALTH
          ================================================== */}

          {activeStep === 2 &&
            policy.policyType === "Health" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Blood Group *
                  </label>

                  <select
                    name="bloodGroup"
                    value={
                      healthDetails.bloodGroup
                    }
                    onChange={
                      handleHealthChange
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="">
                      Select blood group
                    </option>

                    <option value="A+">
                      A+
                    </option>

                    <option value="A-">
                      A-
                    </option>

                    <option value="B+">
                      B+
                    </option>

                    <option value="B-">
                      B-
                    </option>

                    <option value="AB+">
                      AB+
                    </option>

                    <option value="AB-">
                      AB-
                    </option>

                    <option value="O+">
                      O+
                    </option>

                    <option value="O-">
                      O-
                    </option>
                  </select>
                </div>

                <Input
                  label="Height"
                  name="height"
                  value={
                    healthDetails.height
                  }
                  onChange={
                    handleHealthChange
                  }
                  placeholder="Example: 165 cm"
                  required
                />

                <Input
                  label="Weight"
                  name="weight"
                  value={
                    healthDetails.weight
                  }
                  onChange={
                    handleHealthChange
                  }
                  placeholder="Example: 60 kg"
                  required
                />

                <Input
                  label="Existing Disease"
                  name="existingDisease"
                  value={
                    healthDetails.existingDisease
                  }
                  onChange={
                    handleHealthChange
                  }
                  placeholder="Enter if applicable"
                />

                <div className="md:col-span-2">

                  <label className="block text-sm text-slate-300 mb-2">
                    Medical History
                  </label>

                  <textarea
                    name="medicalHistory"
                    value={
                      healthDetails.medicalHistory
                    }
                    onChange={
                      handleHealthChange
                    }
                    rows={4}
                    placeholder="Provide relevant medical history"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 resize-none"
                  />

                </div>

              </div>
            )}

          {/* ==================================================
              STEP 2 - HOME
          ================================================== */}

          {activeStep === 2 &&
            policy.policyType === "Home" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Property Type *
                  </label>

                  <select
                    name="propertyType"
                    value={
                      homeDetails.propertyType
                    }
                    onChange={
                      handleHomeChange
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="">
                      Select property type
                    </option>

                    <option value="House">
                      House
                    </option>

                    <option value="Apartment">
                      Apartment
                    </option>

                    <option value="Villa">
                      Villa
                    </option>

                    <option value="Commercial">
                      Commercial
                    </option>
                  </select>
                </div>

                <Input
                  label="Property Value"
                  name="propertyValue"
                  value={
                    homeDetails.propertyValue
                  }
                  onChange={
                    handleHomeChange
                  }
                  placeholder="Enter property value"
                  required
                />

                <Input
                  label="Year Built"
                  name="yearBuilt"
                  value={
                    homeDetails.yearBuilt
                  }
                  onChange={
                    handleHomeChange
                  }
                  placeholder="Example: 2020"
                />

                <div className="md:col-span-2">

                  <label className="block text-sm text-slate-300 mb-2">
                    Property Address *
                  </label>

                  <textarea
                    name="propertyAddress"
                    value={
                      homeDetails.propertyAddress
                    }
                    onChange={
                      handleHomeChange
                    }
                    rows={4}
                    placeholder="Enter property address"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 resize-none"
                  />

                </div>

              </div>
            )}

          {/* ==================================================
              STEP 2 - LIFE
          ================================================== */}

          {activeStep === 2 &&
            policy.policyType === "Life" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Input
                  label="Nominee Name"
                  name="nomineeName"
                  value={
                    lifeDetails.nomineeName
                  }
                  onChange={
                    handleLifeChange
                  }
                  placeholder="Enter nominee name"
                  required
                />

                <Input
                  label="Nominee Relationship"
                  name="nomineeRelation"
                  value={
                    lifeDetails.nomineeRelation
                  }
                  onChange={
                    handleLifeChange
                  }
                  placeholder="Example: Spouse"
                  required
                />

                <Input
                  label="Nominee Phone"
                  name="nomineePhone"
                  type="tel"
                  value={
                    lifeDetails.nomineePhone
                  }
                  onChange={
                    handleLifeChange
                  }
                  placeholder="Enter nominee phone"
                  required
                />

              </div>
            )}

          {/* ==================================================
              STEP 2 - OTHER POLICY TYPES
          ================================================== */}

          {activeStep === 2 &&
            ![
              "Vehicle",
              "Health",
              "Home",
              "Life",
            ].includes(policy.policyType) && (
              <div className="bg-slate-800/60 rounded-xl p-6">

                <p className="text-slate-300">
                  No additional information is required
                  for this policy type.
                </p>

              </div>
            )}

          {/* ==================================================
              STEP 3 - DOCUMENTS
          ================================================== */}

          {activeStep === 3 && (
            <div className="space-y-5">

              <DocumentInput
                label="ID Proof"
                name="idProof"
                file={
                  documents.idProof
                }
                onChange={
                  handleDocumentChange
                }
              />

              <DocumentInput
                label="Address Proof"
                name="addressProof"
                file={
                  documents.addressProof
                }
                onChange={
                  handleDocumentChange
                }
              />

              {policy.policyType ===
                "Health" && (
                <DocumentInput
                  label="Medical Certificate"
                  name="medicalCertificate"
                  file={
                    documents.medicalCertificate
                  }
                  onChange={
                    handleDocumentChange
                  }
                />
              )}

              {policy.policyType ===
                "Vehicle" && (
                <DocumentInput
                  label="Vehicle Document"
                  name="vehicleDocument"
                  file={
                    documents.vehicleDocument
                  }
                  onChange={
                    handleDocumentChange
                  }
                />
              )}

              <DocumentInput
                label="Other Document"
                name="otherDocument"
                file={
                  documents.otherDocument
                }
                onChange={
                  handleDocumentChange
                }
              />

              {/* -------------------------
                  FINAL NOTICE
              ------------------------- */}

              <div className="mt-6 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-5">

                <h3 className="font-semibold text-cyan-300">
                  Before submitting
                </h3>

                <p className="text-sm text-slate-300 mt-2 leading-6">
                  Please make sure all the information
                  you entered is correct. Your application
                  will be sent to the administrator for
                  verification.
                </p>

                <p className="text-sm text-slate-400 mt-2">
                  Your policy will remain{" "}
                  <span className="text-yellow-400 font-semibold">
                    Pending
                  </span>{" "}
                  until the administrator reviews it.
                </p>

              </div>

            </div>
          )}

          {/* ==================================================
              BUTTONS
          ================================================== */}

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-slate-800">

            <button
              type="button"
              onClick={
                activeStep === 1
                  ? () =>
                      navigate(
                        "/policies"
                      )
                  : handleBack
              }
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition"
            >
              {activeStep === 1
                ? "Cancel"
                : "← Back"}
            </button>

            {activeStep < 3 ? (
              <button
                type="button"
                onClick={handleContinue}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 disabled:opacity-50 transition"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitPolicy}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 disabled:opacity-50 transition"
              >
                {loading
                  ? "Submitting..."
                  : "Submit Application"}
              </button>
            )}

          </div>

        </section>

      </main>
    </div>
  );
}

// ======================================================
// INPUT COMPONENT
// ======================================================

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">
        {label}{" "}
        {required && (
          <span className="text-red-400">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition"
      />
    </div>
  );
}

// ======================================================
// DOCUMENT INPUT
// ======================================================

function DocumentInput({
  label,
  name,
  file,
  onChange,
}) {
  return (
    <div>

      <label className="block text-sm text-slate-300 mb-2">
        {label}
      </label>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">

        <input
          type="file"
          name={name}
          onChange={onChange}
          className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-slate-950 file:font-semibold hover:file:bg-cyan-400"
        />

        {file && (
          <p className="text-sm text-green-400 mt-3">
            ✓ {file.name}
          </p>
        )}

      </div>

    </div>
  );
}

export default PolicyDetails;
