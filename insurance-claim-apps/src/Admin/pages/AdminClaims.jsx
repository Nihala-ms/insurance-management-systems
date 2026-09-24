import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllClaims,
  updateClaimStatus,
} from "../../services/api";

function AdminClaims() {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================================================
  // ADMIN PROTECTION
  // =========================================================
  useEffect(() => {
    if (!user) {
      navigate("/Auth");
      return;
    }

    if (user.role !== "admin") {
      alert("Access denied. Admin only.");
      navigate("/dashboard");
    }
  }, [navigate]);

  // =========================================================
  // FETCH ALL CLAIMS
  // =========================================================
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getAllClaims();

        setClaims(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("FETCH CLAIMS ERROR:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin") {
      fetchClaims();
    } else {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // DATE FORMATTER
  // =========================================================
  const formatDate = (date) => {
    if (!date) {
      return "Not provided";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not provided";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // GET POLICY TYPE
  // =========================================================
  const getPolicyType = (claim) => {
    return (
      claim.userPolicy?.policy?.policyType ||
      claim.userPolicy?.policy?.type ||
      claim.policyType ||
      ""
    );
  };

  // =========================================================
  // CHECK VEHICLE / HEALTH
  // =========================================================
  const isVehicleClaim = (claim) => {
    const type = getPolicyType(claim).toLowerCase();

    return (
      type.includes("vehicle") ||
      type.includes("motor")
    );
  };

  const isHealthClaim = (claim) => {
    const type = getPolicyType(claim).toLowerCase();

    return type.includes("health");
  };

  // =========================================================
  // HANDLE REMARKS
  // =========================================================
  const handleRemarksChange = (claimId, value) => {
    setRemarks((previousRemarks) => ({
      ...previousRemarks,
      [claimId]: value,
    }));
  };

  // =========================================================
  // UPDATE STATUS + REMARKS
  // =========================================================
  const handleStatusChange = async (
    claimId,
    newStatus
  ) => {
    try {
      setUpdatingId(claimId);

      const data = await updateClaimStatus(
        claimId,
        newStatus,
        remarks[claimId] || ""
      );

      setClaims((previousClaims) =>
        previousClaims.map((claim) =>
          claim._id === claimId
            ? data.claim
            : claim
        )
      );

      // Clear local remark after successful update
      setRemarks((previousRemarks) => {
        const updatedRemarks = {
          ...previousRemarks,
        };

        delete updatedRemarks[claimId];

        return updatedRemarks;
      });

      alert("Claim updated successfully");
    } catch (error) {
      console.error("UPDATE CLAIM ERROR:", error);
      alert(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">
          Loading claims...
        </p>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Admin Claims
          </h1>

          <p className="text-gray-400 mt-2">
            Review and manage all insurance claims.
          </p>
        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          {/* Total */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400">
              Total Claims
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {claims.length}
            </h2>
          </div>

          {/* Pending */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-yellow-400 mt-2">
              {
                claims.filter(
                  (claim) =>
                    claim.status === "Pending"
                ).length
              }
            </h2>
          </div>

          {/* Under Review */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400">
              Under Review
            </p>

            <h2 className="text-3xl font-bold text-blue-400 mt-2">
              {
                claims.filter(
                  (claim) =>
                    claim.status === "Under Review"
                ).length
              }
            </h2>
          </div>

          {/* Approved */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400">
              Approved
            </p>

            <h2 className="text-3xl font-bold text-green-400 mt-2">
              {
                claims.filter(
                  (claim) =>
                    claim.status === "Approved"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* =================================================
            NO CLAIMS
        ================================================= */}
        {claims.length === 0 ? (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold">
              No Claims Found
            </h2>

            <p className="text-gray-400 mt-3">
              No users have submitted claims yet.
            </p>
          </div>
        ) : (

          /* =================================================
             CLAIM LIST
          ================================================= */
          <div className="space-y-6">

            {claims.map((claim) => {

              const vehicleClaim =
                isVehicleClaim(claim);

              const healthClaim =
                isHealthClaim(claim);

              return (
                <div
                  key={claim._id}
                  className="bg-gray-950 border border-gray-800 rounded-3xl p-6"
                >

                  {/* =================================================
                      TOP SECTION
                  ================================================= */}
                  <div className="flex flex-col lg:flex-row justify-between gap-8">

                    {/* =================================================
                        CLAIM INFORMATION
                    ================================================= */}
                    <div className="space-y-3 flex-1">

                      {/* Claim Number */}
                      <p className="text-blue-400 font-semibold">
                        {claim.claimNumber}
                      </p>

                      {/* Claim Type */}
                      <h2 className="text-2xl font-bold">
                        {claim.claimType}
                      </h2>

                      {/* Policy Type */}
                      <p className="text-gray-400">
                        Policy Type:{" "}
                        <span className="text-white">
                          {getPolicyType(claim) ||
                            "Not specified"}
                        </span>
                      </p>

                      {/* User */}
                      <p className="text-gray-400">
                        User:{" "}
                        <span className="text-white">
                          {claim.user?.fullName ||
                            claim.user?.name ||
                            "Unknown User"}
                        </span>
                      </p>

                      {/* Email */}
                      <p className="text-gray-400">
                        Email:{" "}
                        <span className="text-white">
                          {claim.user?.email ||
                            "No email"}
                        </span>
                      </p>

                      {/* Policy */}
                      <p className="text-gray-400">
                        Policy:{" "}
                        <span className="text-white">
                          {claim.userPolicy?.policy
                            ?.policyName ||
                            "Insurance Policy"}
                        </span>
                      </p>

                      {/* Claim Amount */}
                      <p className="text-gray-400">
                        Claim Amount:{" "}
                        <span className="text-white font-semibold">
                          ₹
                          {Number(
                            claim.claimAmount || 0
                          ).toLocaleString("en-IN")}
                        </span>
                      </p>

                      {/* =================================================
                          VEHICLE INFORMATION
                      ================================================= */}
                      {vehicleClaim && (
                        <div className="mt-5 bg-black border border-gray-800 rounded-2xl p-5">

                          <h3 className="text-lg font-semibold text-blue-400 mb-4">
                            Vehicle Claim Details
                          </h3>

                          <div className="grid md:grid-cols-2 gap-4">

                            {/* Vehicle Number */}
                            <div>
                              <p className="text-gray-500 text-sm">
                                Vehicle Number
                              </p>

                              <p className="mt-1">
                                {claim.vehicleNumber ||
                                  "Not provided"}
                              </p>
                            </div>

                            {/* Incident Date */}
                            <div>
                              <p className="text-gray-500 text-sm">
                                Incident Date
                              </p>

                              <p className="mt-1">
                                {formatDate(
                                  claim.incidentDate
                                )}
                              </p>
                            </div>

                            {/* Incident Location */}
                            <div>
                              <p className="text-gray-500 text-sm">
                                Incident Location
                              </p>

                              <p className="mt-1">
                                {claim.incidentLocation ||
                                  "Not provided"}
                              </p>
                            </div>

                            {/* Vehicle Damage */}
                            <div>
                              <p className="text-gray-500 text-sm">
                                Vehicle Damage
                              </p>

                              <p className="mt-1">
                                {claim.vehicleDamage ||
                                  "Not provided"}
                              </p>
                            </div>

                          </div>
                        </div>
                      )}

                      {/* =================================================
                          HEALTH INFORMATION
                      ================================================= */}
                      {healthClaim && (
                        <div className="mt-5 bg-black border border-gray-800 rounded-2xl p-5">

                          <h3 className="text-lg font-semibold text-green-400 mb-4">
                            Health Claim Details
                          </h3>

                          <div className="grid md:grid-cols-2 gap-4">

                            {/* Hospital */}
                            <div>
                              <p className="text-gray-500 text-sm">
                                Hospital Name
                              </p>

                              <p className="mt-1">
                                {claim.hospitalName ||
                                  "Not provided"}
                              </p>
                            </div>

                            {/* Admission */}
                            <div>
                              <p className="text-gray-500 text-sm">
                                Admission Date
                              </p>

                              <p className="mt-1">
                                {formatDate(
                                  claim.admissionDate
                                )}
                              </p>
                            </div>

                            {/* Discharge */}
                            <div>
                              <p className="text-gray-500 text-sm">
                                Discharge Date
                              </p>

                              <p className="mt-1">
                                {formatDate(
                                  claim.dischargeDate
                                )}
                              </p>
                            </div>

                            {/* Treatment */}
                            <div className="md:col-span-2">
                              <p className="text-gray-500 text-sm">
                                Treatment Details
                              </p>

                              <p className="mt-1">
                                {claim.treatmentDetails ||
                                  "Not provided"}
                              </p>
                            </div>

                          </div>
                        </div>
                      )}

                    </div>

                    {/* =================================================
                        STATUS + REMARKS
                    ================================================= */}
                    <div className="flex flex-col gap-4 lg:w-80">

                      <label className="text-gray-400">
                        Claim Status
                      </label>

                      <select
                        value={claim.status || "Pending"}
                        onChange={(e) => {

                          setClaims(
                            (previousClaims) =>
                              previousClaims.map(
                                (currentClaim) =>
                                  currentClaim._id ===
                                  claim._id
                                    ? {
                                        ...currentClaim,
                                        status:
                                          e.target.value,
                                      }
                                    : currentClaim
                              )
                          );
                        }}
                        disabled={
                          updatingId === claim._id
                        }
                        className="bg-black border border-gray-700 rounded-xl px-4 py-3"
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Under Review">
                          Under Review
                        </option>

                        <option value="Approved">
                          Approved
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>
                      </select>

                      {/* Admin Remarks */}
                      <label className="text-gray-400">
                        Admin Remarks
                      </label>

                      <textarea
                        value={
                          remarks[claim._id] ??
                          claim.adminRemarks ??
                          ""
                        }
                        onChange={(e) =>
                          handleRemarksChange(
                            claim._id,
                            e.target.value
                          )
                        }
                        placeholder="Add remarks for the user..."
                        rows="4"
                        className="bg-black border border-gray-700 rounded-xl px-4 py-3 resize-none"
                      />

                      {/* Save */}
                      <button
                        onClick={() =>
                          handleStatusChange(
                            claim._id,
                            claim.status
                          )
                        }
                        disabled={
                          updatingId === claim._id
                        }
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-xl font-semibold"
                      >
                        {updatingId === claim._id
                          ? "Saving..."
                          : "Save Update"}
                      </button>

                    </div>
                  </div>

                  {/* =================================================
                      COMMON CLAIM INFORMATION
                  ================================================= */}
                  <div className="border-t border-gray-800 mt-6 pt-5">

                    <h3 className="font-semibold text-lg">
                      Claim Description
                    </h3>

                    <p className="text-gray-400 mt-2">
                      {claim.description ||
                        "No description provided"}
                    </p>

                  </div>

                  {/* =================================================
                      CONTACT
                  ================================================= */}
                  <div className="mt-5">

                    <div className="bg-black border border-gray-800 rounded-xl p-4">

                      <p className="text-gray-500 text-sm">
                        Contact Number
                      </p>

                      <p className="mt-1">
                        {claim.contactNumber ||
                          "Not provided"}
                      </p>

                    </div>

                  </div>

                  {/* =================================================
                      DOCUMENTS
                  ================================================= */}
                  {claim.documents?.length > 0 && (
                    <div className="mt-5">

                      <h3 className="font-semibold mb-3">
                        Uploaded Documents
                      </h3>

                      <div className="flex flex-wrap gap-3">

                        {claim.documents.map(
                          (document, index) => (

                            <div
                              key={index}
                              className="bg-black border border-gray-800 rounded-xl px-4 py-3"
                            >

                              <p className="text-sm">
                                {document.fileName}
                              </p>

                              <p className="text-gray-500 text-xs mt-1">
                                {document.fileType}
                              </p>

                              {document.fileSize && (
                                <p className="text-gray-600 text-xs mt-1">
                                  {(
                                    document.fileSize /
                                    1024
                                  ).toFixed(1)}{" "}
                                  KB
                                </p>
                              )}

                              {document.fileUrl && (
                                <a
                                  href={
                                    document.fileUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-400 text-sm mt-2 inline-block hover:underline"
                                >
                                  View Document
                                </a>
                              )}

                            </div>
                          )
                        )}

                      </div>
                    </div>
                  )}

                  {/* =================================================
                      CURRENT ADMIN REMARKS
                  ================================================= */}
                  {claim.adminRemarks && (
                    <div className="mt-5 bg-blue-950 border border-blue-800 rounded-xl p-4">

                      <h3 className="font-semibold text-blue-300">
                        Current Admin Remarks
                      </h3>

                      <p className="text-gray-300 mt-2">
                        {claim.adminRemarks}
                      </p>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
}

export default AdminClaims;