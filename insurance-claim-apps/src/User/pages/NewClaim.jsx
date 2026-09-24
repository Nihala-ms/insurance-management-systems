import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUserPolicies,
  submitClaim,
} from "../../services/api";

function NewClaim() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [userPolicies, setUserPolicies] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [formData, setFormData] = useState({
    userPolicyId: "",
    claimType: "",
    incidentDate: "",
    incidentLocation: "",
    contactNumber: "",
    description: "",
    claimAmount: "",

    // Vehicle fields
    vehicleNumber: "",
    vehicleDamage: "",

    // Health fields
    hospitalName: "",
    treatmentDetails: "",
    admissionDate: "",
    dischargeDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --------------------------------------------------
  // Get selected policy
  // --------------------------------------------------

  const selectedPolicy = userPolicies.find(
    (item) => item._id === formData.userPolicyId
  );

  // Get policy type safely
  const policyType =
    selectedPolicy?.policy?.policyType ||
    selectedPolicy?.policy?.type ||
    selectedPolicy?.policyType ||
    selectedPolicy?.type ||
    "";

  const isVehicleInsurance =
    policyType.toLowerCase().includes("vehicle") ||
    policyType.toLowerCase().includes("motor");

  const isHealthInsurance =
    policyType.toLowerCase().includes("health");

  // --------------------------------------------------
  // Fetch user's active policies
  // --------------------------------------------------

  useEffect(() => {
    if (!userId) {
      navigate("/Auth");
      return;
    }

    const fetchPolicies = async () => {
      try {
        const data = await getUserPolicies(userId);

        const activePolicies = data.filter(
          (item) => item.status === "Active"
        );

        setUserPolicies(activePolicies);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [userId, navigate]);

  // --------------------------------------------------
  // Handle inputs
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Handle policy selection
  // --------------------------------------------------

  const handlePolicyChange = (e) => {
    const selectedId = e.target.value;

    // Clear all claim-specific fields
    setFormData({
      userPolicyId: selectedId,
      claimType: "",
      incidentDate: "",
      incidentLocation: "",
      contactNumber: "",
      description: "",
      claimAmount: "",

      vehicleNumber: "",
      vehicleDamage: "",

      hospitalName: "",
      treatmentDetails: "",
      admissionDate: "",
      dischargeDate: "",
    });

    // Clear previously selected documents
    setDocuments([]);
  };

  // --------------------------------------------------
  // Handle document upload
  // --------------------------------------------------

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    const invalidFiles = selectedFiles.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert("Only JPG, PNG, and PDF files are allowed.");
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    const largeFiles = selectedFiles.filter(
      (file) => file.size > maxFileSize
    );

    if (largeFiles.length > 0) {
      alert("Each file must be less than 5MB.");
      return;
    }

    setDocuments(selectedFiles);
  };

  // --------------------------------------------------
  // Remove document
  // --------------------------------------------------

  const removeDocument = (indexToRemove) => {
    setDocuments((previousDocuments) =>
      previousDocuments.filter(
        (_, index) => index !== indexToRemove
      )
    );
  };

  // --------------------------------------------------
  // Submit claim
  // --------------------------------------------------

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!userId) {
    alert("User not found. Please login again.");
    navigate("/Auth");
    return;
  }

  if (!formData.userPolicyId) {
    alert("Please select a policy.");
    return;
  }

  if (!selectedPolicy) {
    alert("Please select a valid policy.");
    return;
  }

  // -----------------------------------------------
  // Validate common required fields
  // -----------------------------------------------

  if (!formData.claimType) {
    alert("Please select a claim type.");
    return;
  }

  if (!formData.contactNumber) {
    alert("Please enter your contact number.");
    return;
  }

  if (!formData.claimAmount) {
    alert("Please enter the claim amount.");
    return;
  }

  if (!formData.description) {
    alert("Please enter a description.");
    return;
  }

  // -----------------------------------------------
  // Vehicle validation
  // -----------------------------------------------

  if (isVehicleInsurance) {
    if (!formData.vehicleNumber) {
      alert("Please enter the vehicle number.");
      return;
    }

    if (!formData.incidentDate) {
      alert("Please select the incident date.");
      return;
    }

    if (!formData.incidentLocation) {
      alert("Please enter the incident location.");
      return;
    }

    if (!formData.vehicleDamage) {
      alert("Please enter the vehicle damage details.");
      return;
    }
  }

  // -----------------------------------------------
  // Health validation
  // -----------------------------------------------

  if (isHealthInsurance) {
    if (!formData.hospitalName) {
      alert("Please enter the hospital name.");
      return;
    }

    if (!formData.admissionDate) {
      alert("Please select the admission date.");
      return;
    }

    if (!formData.treatmentDetails) {
      alert("Please enter the treatment details.");
      return;
    }
  }

  try {
    setSubmitting(true);

    const claimData = new FormData();

    // -----------------------------------------------
    // Common fields
    // -----------------------------------------------

    claimData.append("userId", userId);

    claimData.append(
      "userPolicyId",
      formData.userPolicyId
    );

    claimData.append(
      "claimType",
      formData.claimType
    );

    claimData.append(
      "contactNumber",
      formData.contactNumber
    );

    claimData.append(
      "description",
      formData.description
    );

    claimData.append(
      "claimAmount",
      formData.claimAmount
    );

    // -----------------------------------------------
    // Incident date
    //
    // Vehicle -> incidentDate
    // Health  -> admissionDate
    // -----------------------------------------------

    if (isVehicleInsurance) {
      claimData.append(
        "incidentDate",
        formData.incidentDate
      );

      claimData.append(
        "incidentLocation",
        formData.incidentLocation
      );
    }

    if (isHealthInsurance) {
      claimData.append(
        "incidentDate",
        formData.admissionDate
      );

      // Health claims don't require an incident location
      claimData.append(
        "incidentLocation",
        ""
      );
    }

    // -----------------------------------------------
    // Vehicle specific fields
    // -----------------------------------------------

    if (isVehicleInsurance) {
      claimData.append(
        "vehicleNumber",
        formData.vehicleNumber
      );

      claimData.append(
        "vehicleDamage",
        formData.vehicleDamage
      );
    }

    // -----------------------------------------------
    // Health specific fields
    // -----------------------------------------------

    if (isHealthInsurance) {
      claimData.append(
        "hospitalName",
        formData.hospitalName
      );

      claimData.append(
        "treatmentDetails",
        formData.treatmentDetails
      );

      claimData.append(
        "admissionDate",
        formData.admissionDate
      );

      claimData.append(
        "dischargeDate",
        formData.dischargeDate
      );
    }

    // -----------------------------------------------
    // Documents
    // -----------------------------------------------

    documents.forEach((file) => {
      claimData.append(
        "documents",
        file
      );
    });

    // Debug FormData
    console.log(
      "========== CLAIM DATA =========="
    );

    for (const [key, value] of claimData.entries()) {
      console.log(key, value);
    }

    console.log(
      "================================"
    );

    const data = await submitClaim(claimData);

    alert(
      data.message ||
        "Claim submitted successfully"
    );

    navigate("/claims");

  } catch (error) {
    console.error(
      "CLAIM SUBMISSION ERROR:",
      error
    );

    alert(
      error.message ||
        "Failed to submit claim"
    );

  } finally {
    setSubmitting(false);
  }
};  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading your policies...
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}

        <h1 className="text-4xl font-bold mb-3">
          Submit New Claim
        </h1>

        <p className="text-gray-400 mb-8">
          Submit a claim for one of your active insurance policies.
        </p>

        {/* No Active Policies */}

        {userPolicies.length === 0 ? (
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8 text-center">

            <h2 className="text-2xl font-bold">
              No Active Policies
            </h2>

            <p className="text-gray-400 mt-3">
              You need an active insurance policy before submitting a claim.
            </p>

            <button
              onClick={() => navigate("/policies")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
            >
              Browse Policies
            </button>

          </div>
        ) : (

          <form
            onSubmit={handleSubmit}
            className="bg-gray-950 border border-gray-800 rounded-3xl p-8 space-y-6"
          >

            {/* =====================================================
                SELECT POLICY
            ====================================================== */}

            <div>
              <label className="block text-gray-300 mb-2">
                Select Policy
              </label>

              <select
                name="userPolicyId"
                value={formData.userPolicyId}
                onChange={handlePolicyChange}
                required
                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
              >
                <option value="">
                  Select your policy
                </option>

                {userPolicies.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.policy?.policyName} -{" "}
                    {item.policyNumber}
                  </option>
                ))}
              </select>
            </div>


            {/* =====================================================
                SHOW FORM ONLY AFTER POLICY IS SELECTED
            ====================================================== */}

            {selectedPolicy && (

              <>

                {/* =================================================
                    VEHICLE INSURANCE
                ================================================== */}

                {isVehicleInsurance && (
                  <div className="space-y-6">

                    <div className="border-b border-gray-800 pb-3">
                      <h2 className="text-xl font-semibold text-blue-400">
                        Vehicle Insurance Claim
                      </h2>

                      <p className="text-gray-500 text-sm mt-1">
                        Enter the details related to your vehicle claim.
                      </p>
                    </div>

                    {/* Vehicle Number */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Vehicle Number
                      </label>

                      <input
                        type="text"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleChange}
                        required
                        placeholder="Example: KL-10-AB-1234"
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Claim Type */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Claim Type
                      </label>

                      <select
                        name="claimType"
                        value={formData.claimType}
                        onChange={handleChange}
                        required
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      >
                        <option value="">
                          Select claim type
                        </option>

                        <option value="Accident">
                          Accident
                        </option>

                        <option value="Vehicle Damage">
                          Vehicle Damage
                        </option>

                        <option value="Theft">
                          Theft
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </select>
                    </div>

                    {/* Incident Date */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Incident Date
                      </label>

                      <input
                        type="date"
                        name="incidentDate"
                        value={formData.incidentDate}
                        onChange={handleChange}
                        required
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Incident Location */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Accident / Incident Location
                      </label>

                      <input
                        type="text"
                        name="incidentLocation"
                        value={formData.incidentLocation}
                        onChange={handleChange}
                        required
                        placeholder="Where did the accident happen?"
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Vehicle Damage */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Vehicle Damage Details
                      </label>

                      <textarea
                        name="vehicleDamage"
                        value={formData.vehicleDamage}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Describe the damage to the vehicle..."
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Contact Number */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Contact Number
                      </label>

                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        placeholder="Enter your contact number"
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Claim Amount */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Claim Amount
                      </label>

                      <input
                        type="number"
                        name="claimAmount"
                        value={formData.claimAmount}
                        onChange={handleChange}
                        min="1"
                        required
                        placeholder="Enter claim amount"
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Description */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Additional Description
                      </label>

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Add any additional information..."
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                  </div>
                )}


                {/* =================================================
                    HEALTH INSURANCE
                ================================================== */}

                {isHealthInsurance && (
                  <div className="space-y-6">

                    <div className="border-b border-gray-800 pb-3">
                      <h2 className="text-xl font-semibold text-green-400">
                        Health Insurance Claim
                      </h2>

                      <p className="text-gray-500 text-sm mt-1">
                        Enter the medical and hospitalization details.
                      </p>
                    </div>

                    {/* Claim Type */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Claim Type
                      </label>

                      <select
                        name="claimType"
                        value={formData.claimType}
                        onChange={handleChange}
                        required
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      >
                        <option value="">
                          Select claim type
                        </option>

                        <option value="Hospitalization">
                          Hospitalization
                        </option>

                        <option value="Medical Emergency">
                          Medical Emergency
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </select>
                    </div>

                    {/* Hospital Name */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Hospital Name
                      </label>

                      <input
                        type="text"
                        name="hospitalName"
                        value={formData.hospitalName}
                        onChange={handleChange}
                        required
                        placeholder="Enter hospital name"
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Admission Date */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Admission Date
                      </label>

                      <input
                        type="date"
                        name="admissionDate"
                        value={formData.admissionDate}
                        onChange={handleChange}
                        required
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Discharge Date */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Discharge Date
                      </label>

                      <input
                        type="date"
                        name="dischargeDate"
                        value={formData.dischargeDate}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Treatment Details */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Treatment / Medical Details
                      </label>

                      <textarea
                        name="treatmentDetails"
                        value={formData.treatmentDetails}
                        onChange={handleChange}
                        required
                        rows="5"
                        placeholder="Describe the treatment, illness, medical emergency, etc."
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Contact Number */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Contact Number
                      </label>

                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                        placeholder="Enter your contact number"
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Claim Amount */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Claim Amount
                      </label>

                      <input
                        type="number"
                        name="claimAmount"
                        value={formData.claimAmount}
                        onChange={handleChange}
                        min="1"
                        required
                        placeholder="Enter medical claim amount"
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                    {/* Description */}

                    <div>
                      <label className="block text-gray-300 mb-2">
                        Additional Description
                      </label>

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Add any additional information..."
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                      />
                    </div>

                  </div>
                )}


                {/* =================================================
                    SUPPORTING DOCUMENTS
                ================================================== */}

                <div>

                  <label className="block text-gray-300 mb-2">
                    Supporting Documents
                  </label>

                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3"
                  />

                  <p className="text-gray-500 text-sm mt-2">
                    {isVehicleInsurance
                      ? "Upload vehicle photos, police report, repair estimate, or other supporting documents."
                      : "Upload medical bills, prescriptions, hospital documents, or other supporting documents."
                    }
                  </p>

                  <p className="text-gray-500 text-sm">
                    Maximum file size: 5MB per file.
                  </p>

                </div>


                {/* =================================================
                    SELECTED DOCUMENTS
                ================================================== */}

                {documents.length > 0 && (

                  <div className="bg-black border border-gray-800 rounded-xl p-4">

                    <h3 className="font-semibold mb-3">
                      Selected Documents
                    </h3>

                    <div className="space-y-2">

                      {documents.map((file, index) => (

                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-900 p-3 rounded-lg"
                        >

                          <div>

                            <p className="text-sm">
                              {file.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeDocument(index)
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>

                        </div>

                      ))}

                    </div>

                  </div>

                )}


                {/* =================================================
                    SUBMIT
                ================================================== */}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-xl font-semibold"
                >
                  {submitting
                    ? "Submitting Claim..."
                    : "Submit Claim"}
                </button>

              </>

            )}

          </form>

        )}

      </div>
    </div>
  );
}

export default NewClaim;
