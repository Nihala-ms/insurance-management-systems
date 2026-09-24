import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Shield,
  FileText,
  IndianRupee,
  Calendar,
  Mail,
  Phone,
  AlertCircle,
  MessageSquare,
  MapPin,
  Car,
  Hospital,
  ClipboardList,
} from "lucide-react";

import {
  getAllClaims,
  updateClaimStatus,
} from "../../services/api";

const AdminClaimReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Rejection modal
  const [showRejectModal, setShowRejectModal] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  // =========================================================
  // GET CLAIM
  // =========================================================
  useEffect(() => {
    const fetchClaim = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Review Claim ID:", id);

        const response = await getAllClaims();

        console.log("All Claims Response:", response);

        let claimsData = [];

        if (Array.isArray(response)) {
          claimsData = response;
        } else if (
          Array.isArray(response?.claims)
        ) {
          claimsData = response.claims;
        } else if (
          Array.isArray(response?.data)
        ) {
          claimsData = response.data;
        } else if (
          Array.isArray(response?.data?.claims)
        ) {
          claimsData = response.data.claims;
        }

        console.log("Claims Data:", claimsData);

        const foundClaim = claimsData.find(
          (item) =>
            String(item?._id) === String(id)
        );

        console.log("Found Claim:", foundClaim);

        if (!foundClaim) {
          setError(
            "This claim could not be found in the admin claims list."
          );

          setClaim(null);
          return;
        }

        setClaim(foundClaim);
      } catch (err) {
        console.error(
          "Error loading claim:",
          err
        );

        setError(
          err?.message ||
            "Failed to load claim details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClaim();
    } else {
      setError("Claim ID is missing.");
      setLoading(false);
    }
  }, [id]);

  // =========================================================
  // DATE FORMATTER
  // =========================================================
  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // APPROVE CLAIM
  // =========================================================
  const handleApprove = async () => {
    if (!claim?._id) {
      alert("Claim ID is missing.");
      return;
    }

    try {
      setUpdating(true);

      console.log(
        "Approving claim:",
        claim._id
      );

      const response =
        await updateClaimStatus(
          claim._id,
          "Approved",
          ""
        );

      console.log(
        "Approve response:",
        response
      );

      setClaim((previousClaim) => ({
        ...previousClaim,
        status: "Approved",
        adminRemarks: "",
      }));

      alert("Claim approved successfully!");
    } catch (error) {
      console.error(
        "Approve claim failed:",
        error
      );

      alert(
        error?.message ||
          "Unable to approve claim."
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // OPEN REJECT MODAL
  // =========================================================
  const handleRejectClick = () => {
    setRejectionReason("");
    setShowRejectModal(true);
  };

  // =========================================================
  // CONFIRM REJECTION
  // =========================================================
  const handleConfirmReject = async () => {
    const reason =
      rejectionReason.trim();

    if (!reason) {
      alert(
        "Please enter a reason for rejecting the claim."
      );
      return;
    }

    if (!claim?._id) {
      alert("Claim ID is missing.");
      return;
    }

    try {
      setUpdating(true);

      console.log(
        "Rejecting claim:",
        claim._id
      );

      console.log(
        "Rejection reason:",
        reason
      );

      const response =
        await updateClaimStatus(
          claim._id,
          "Rejected",
          reason
        );

      console.log(
        "Reject response:",
        response
      );

      setClaim((previousClaim) => ({
        ...previousClaim,
        status: "Rejected",
        adminRemarks: reason,
      }));

      setShowRejectModal(false);
      setRejectionReason("");

      alert(
        "Claim rejected successfully!"
      );
    } catch (error) {
      console.error(
        "Reject claim failed:",
        error
      );

      alert(
        error?.message ||
          "Unable to reject claim."
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-400">
            Loading claim details...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================
  if (error || !claim) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-slate-900 border border-red-500/20 rounded-2xl p-8 text-center">

          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
            <AlertCircle
              size={32}
              className="text-red-400"
            />
          </div>

          <h2 className="text-2xl font-bold mb-3">
            Claim Not Found
          </h2>

          <p className="text-slate-400 mb-3">
            {error ||
              "The requested claim could not be found."}
          </p>

          <p className="text-xs text-slate-600 mb-6 break-all">
            Claim ID: {id || "Missing"}
          </p>

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================
  // CLAIM DATA
  // =========================================================
  const user = claim.user || {};

  const userPolicy =
    claim.userPolicy || {};

  const policy =
    userPolicy.policy || {};

  const claimAmount = Number(
    claim.claimAmount ||
      claim.amount ||
      0
  );

  const status =
    claim.status || "Pending";

  const policyType =
    policy.policyType ||
    policy.type ||
    userPolicy.policyType ||
    userPolicy.type ||
    "";

  const normalizedPolicyType =
    String(policyType).toLowerCase();

  const isVehicleClaim =
    normalizedPolicyType.includes(
      "vehicle"
    ) ||
    normalizedPolicyType.includes(
      "motor"
    );

  const isHealthClaim =
    normalizedPolicyType.includes(
      "health"
    );

  const createdDate = formatDate(
    claim.createdAt
  );

  // =========================================================
  // STATUS DESIGN
  // =========================================================
  let statusIcon;
  let statusClass;

  if (status === "Approved") {
    statusIcon = (
      <CheckCircle size={20} />
    );

    statusClass =
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (status === "Rejected") {
    statusIcon = (
      <XCircle size={20} />
    );

    statusClass =
      "bg-red-500/10 text-red-400 border-red-500/20";
  } else if (
    status === "Under Review"
  ) {
    statusIcon = (
      <Clock size={20} />
    );

    statusClass =
      "bg-blue-500/10 text-blue-400 border-blue-500/20";
  } else {
    statusIcon = (
      <Clock size={20} />
    );

    statusClass =
      "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }

  // =========================================================
  // PAGE
  // =========================================================
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
              <Shield
                size={22}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h1 className="font-bold text-lg">
                SecureClaim
              </h1>

              <p className="text-xs text-slate-500">
                Admin Panel
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

        </div>
      </nav>

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ===================================================
            HEADER
        =================================================== */}
        <div className="mb-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-cyan-400 text-sm font-semibold tracking-wider mb-2">
                CLAIM REVIEW
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Review Insurance Claim
              </h2>

              <p className="text-slate-400 mt-2">
                Review the submitted claim before making a decision.
              </p>
            </div>

            <div
              className={
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl border " +
                statusClass
              }
            >
              {statusIcon}

              <span className="font-semibold">
                {status}
              </span>
            </div>

          </div>
        </div>

        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          {/* CLAIM ID */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <FileText
                  size={20}
                  className="text-cyan-400"
                />
              </div>

              <span className="text-sm text-slate-400">
                Claim Number
              </span>

            </div>

            <p className="text-sm font-semibold break-all">
              {claim.claimNumber ||
                claim._id}
            </p>

          </div>

          {/* AMOUNT */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <IndianRupee
                  size={20}
                  className="text-emerald-400"
                />
              </div>

              <span className="text-sm text-slate-400">
                Claim Amount
              </span>

            </div>

            <p className="text-2xl font-bold">
              ₹
              {claimAmount.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

          {/* DATE */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Calendar
                  size={20}
                  className="text-purple-400"
                />
              </div>

              <span className="text-sm text-slate-400">
                Submitted On
              </span>

            </div>

            <p className="font-semibold">
              {createdDate}
            </p>

          </div>

        </div>

        {/* ===================================================
            USER + POLICY
        =================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* USER DETAILS */}
          <section className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <User
                  size={20}
                  className="text-cyan-400"
                />
              </div>

              <div>
                <h3 className="font-bold">
                  User Details
                </h3>

                <p className="text-xs text-slate-500">
                  Policy holder information
                </p>
              </div>

            </div>

            <div className="p-6 space-y-5">

              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Full Name
                </p>

                <p className="font-semibold">
                  {user.fullName ||
                    user.name ||
                    "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                  <Mail size={14} />
                  Email
                </p>

                <p className="text-slate-300">
                  {user.email ||
                    "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                  <Phone size={14} />
                  Phone
                </p>

                <p className="text-slate-300">
                  {user.phone ||
                    user.mobile ||
                    claim.contactNumber ||
                    "Not available"}
                </p>
              </div>

            </div>
          </section>

          {/* POLICY DETAILS */}
          <section className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Shield
                  size={20}
                  className="text-indigo-400"
                />
              </div>

              <div>
                <h3 className="font-bold">
                  Policy Details
                </h3>

                <p className="text-xs text-slate-500">
                  Insurance policy information
                </p>
              </div>

            </div>

            <div className="p-6 space-y-5">

              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Policy Name
                </p>

                <p className="font-semibold">
                  {policy.policyName ||
                    policy.name ||
                    "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Policy Type
                </p>

                <p className="text-slate-300">
                  {policyType ||
                    "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Policy Number
                </p>

                <p className="text-slate-300">
                  {userPolicy.policyNumber ||
                    policy.policyNumber ||
                    userPolicy._id ||
                    "Not available"}
                </p>
              </div>

            </div>
          </section>

        </div>

        {/* ===================================================
            CLAIM INFORMATION
        =================================================== */}
        <section className="mt-6 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">

          <div className="px-6 py-5 border-b border-white/10">

            <h3 className="text-lg font-bold">
              Claim Information
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Information submitted by the policy holder
            </p>

          </div>

          <div className="p-6">

            {/* COMMON INFORMATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* CLAIM TYPE */}
              <div>
                <p className="text-xs text-slate-500 mb-2">
                  Claim Type
                </p>

                <div className="bg-slate-950 rounded-xl p-4 border border-white/5">

                  <p className="text-slate-300">
                    {claim.claimType ||
                      "Not available"}
                  </p>

                </div>
              </div>

              {/* CONTACT */}
              <div>
                <p className="text-xs text-slate-500 mb-2">
                  Contact Number
                </p>

                <div className="bg-slate-950 rounded-xl p-4 border border-white/5">

                  <p className="text-slate-300">
                    {claim.contactNumber ||
                      "Not available"}
                  </p>

                </div>
              </div>

            </div>

            {/* =================================================
                VEHICLE CLAIM DETAILS
            ================================================= */}
            {isVehicleClaim && (
              <div className="mt-8">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Car
                      size={20}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      Vehicle Claim Details
                    </h3>

                    <p className="text-xs text-slate-500">
                      Accident and vehicle information
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* VEHICLE NUMBER */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">
                      Vehicle Number
                    </p>

                    <div className="bg-slate-950 rounded-xl p-4 border border-white/5">

                      <p className="text-slate-300">
                        {claim.vehicleNumber ||
                          "Not available"}
                      </p>

                    </div>
                  </div>

                  {/* INCIDENT DATE */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">
                      Incident Date
                    </p>

                    <div className="bg-slate-950 rounded-xl p-4 border border-white/5">

                      <p className="text-slate-300">
                        {formatDate(
                          claim.incidentDate
                        )}
                      </p>

                    </div>
                  </div>

                  {/* INCIDENT LOCATION */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                      <MapPin size={14} />
                      Incident Location
                    </p>

                    <div className="bg-slate-950 rounded-xl p-4 border border-white/5">

                      <p className="text-slate-300">
                        {claim.incidentLocation ||
                          "Not available"}
                      </p>

                    </div>
                  </div>

                  {/* VEHICLE DAMAGE */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">
                      Vehicle Damage
                    </p>

                    <div className="bg-slate-950 rounded-xl p-4 border border-white/5">

                      <p className="text-slate-300 whitespace-pre-wrap">
                        {claim.vehicleDamage ||
                          "Not available"}
                      </p>

                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* =================================================
                HEALTH CLAIM DETAILS
            ================================================= */}
            {isHealthClaim && (
              <div className="mt-8">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Hospital
                      size={20}
                      className="text-emerald-400"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      Health Claim Details
                    </h3>

                    <p className="text-xs text-slate-500">
                      Hospital and treatment information
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* HOSPITAL */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">
                      Hospital Name
                    </p>

                    <div className="bg-slate-950 rounded-xl p-4 border border-white/5">

                      <p className="text-slate-300">
                        {claim.hospitalName ||
                          "Not available"}
                      </p>

                    </div>
                  </div>

                  {/* ADMISSION DATE */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">
                      Admission Date
                    </p>

                    <div className="bg-slate-950 rounded-xl p-4 border border-white/5">

                      <p className="text-slate-300">
                        {formatDate(
                          claim.admissionDate
                        )}
                      </p>

                    </div>
                  </div>

                  {/* DISCHARGE DATE */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">
                      Discharge Date
                    </p>

                    <div className="bg-slate-950 rounded-xl p-4 border border-white/5">

                      <p className="text-slate-300">
                        {formatDate(
                          claim.dischargeDate
                        )}
                      </p>

                    </div>
                  </div>

                  {/* TREATMENT */}
                  <div className="md:col-span-2">

                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                      <ClipboardList size={14} />
                      Treatment Details
                    </p>

                    <div className="bg-slate-950 rounded-xl p-4 border border-white/5">

                      <p className="text-slate-300 whitespace-pre-wrap">
                        {claim.treatmentDetails ||
                          "Not available"}
                      </p>

                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* =================================================
                DESCRIPTION
            ================================================= */}
            <div className="mt-8">

              <p className="text-xs text-slate-500 mb-2">
                Description
              </p>

              <div className="bg-slate-950 rounded-xl p-4 border border-white/5">

                <p className="text-slate-300 whitespace-pre-wrap">
                  {claim.description ||
                    "No description provided."}
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* ===================================================
            DOCUMENTS
        =================================================== */}
        {claim.documents?.length > 0 && (
          <section className="mt-6 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <FileText
                  size={20}
                  className="text-purple-400"
                />
              </div>

              <div>
                <h3 className="font-bold">
                  Uploaded Documents
                </h3>

                <p className="text-xs text-slate-500">
                  Documents submitted with this claim
                </p>
              </div>

            </div>

            <div className="p-6">

              <div className="flex flex-wrap gap-4">

                {claim.documents.map(
                  (document, index) => (
                    <div
                      key={index}
                      className="bg-slate-950 border border-white/10 rounded-xl p-4 min-w-[220px]"
                    >

                      <p className="font-medium break-all">
                        {document.fileName ||
                          `Document ${index + 1}`}
                      </p>

                      <p className="text-xs text-slate-500 mt-2">
                        {document.fileType ||
                          "Unknown file type"}
                      </p>

                      {document.fileSize && (
                        <p className="text-xs text-slate-600 mt-1">
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
                          className="inline-block mt-3 text-cyan-400 text-sm hover:underline"
                        >
                          View Document
                        </a>
                      )}

                    </div>
                  )
                )}

              </div>

            </div>
          </section>
        )}

        {/* ===================================================
            EXISTING ADMIN REMARKS
        =================================================== */}
        {claim.adminRemarks && (
          <section className="mt-6 bg-slate-900 border border-red-500/20 rounded-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">

                <MessageSquare
                  size={20}
                  className="text-red-400"
                />

              </div>

              <div>

                <h3 className="font-bold">
                  Admin Remarks
                </h3>

                <p className="text-xs text-slate-500">
                  Reason provided by the administrator
                </p>

              </div>

            </div>

            <div className="p-6">

              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">

                <p className="text-slate-300 whitespace-pre-wrap">
                  {claim.adminRemarks}
                </p>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            ADMIN ACTIONS
        =================================================== */}
        {status === "Pending" && (
          <section className="mt-8 bg-slate-900 border border-white/10 rounded-2xl p-6">

            <h3 className="text-lg font-bold mb-1">
              Admin Decision
            </h3>

            <p className="text-sm text-slate-500 mb-6">
              Choose whether to approve or reject this claim.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* APPROVE */}
              <button
                type="button"
                onClick={handleApprove}
                disabled={updating}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >

                <CheckCircle size={20} />

                {updating
                  ? "Updating..."
                  : "Approve Claim"}

              </button>

              {/* REJECT */}
              <button
                type="button"
                onClick={handleRejectClick}
                disabled={updating}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >

                <XCircle size={20} />

                Reject Claim

              </button>

            </div>

          </section>
        )}

        {/* ===================================================
            PROCESSED CLAIM
        =================================================== */}
        {status !== "Pending" && (
          <section className="mt-8 bg-slate-900 border border-white/10 rounded-2xl p-6">

            <div className="flex items-center gap-4">

              <div
                className={
                  "w-12 h-12 rounded-xl flex items-center justify-center " +
                  (status === "Approved"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : status ===
                      "Rejected"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-blue-500/10 text-blue-400")
                }
              >

                {status === "Approved" ? (
                  <CheckCircle size={26} />
                ) : status === "Rejected" ? (
                  <XCircle size={26} />
                ) : (
                  <Clock size={26} />
                )}

              </div>

              <div>

                <h3 className="font-bold">
                  Claim {status}
                </h3>

                <p className="text-sm text-slate-500">
                  This claim has already been processed.
                </p>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            BACK BUTTON
        =================================================== */}
        <div className="mt-8">

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition"
          >

            <ArrowLeft size={18} />

            Back to Admin Dashboard

          </button>

        </div>

      </main>

      {/* =====================================================
          REJECTION MODAL
      ===================================================== */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

          {/* BACKGROUND */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              if (!updating) {
                setShowRejectModal(
                  false
                );
              }
            }}
          ></div>

          {/* MODAL */}
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center">

                <XCircle
                  size={24}
                  className="text-red-400"
                />

              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Reject Claim
                </h3>

                <p className="text-sm text-slate-500">
                  Please provide a reason for rejection.
                </p>

              </div>

            </div>

            {/* BODY */}
            <div className="p-6">

              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rejection Reason
              </label>

              <textarea
                value={rejectionReason}
                onChange={(e) =>
                  setRejectionReason(
                    e.target.value
                  )
                }
                placeholder="Enter the reason why this claim is being rejected..."
                rows={5}
                disabled={updating}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-red-400/50 focus:ring-2 focus:ring-red-400/10 resize-none disabled:opacity-50"
              />

              <p className="text-xs text-slate-500 mt-2">
                This reason will be saved with the claim and can be shown to the policy holder.
              </p>

            </div>

            {/* FOOTER */}
            <div className="px-6 py-5 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:justify-end">

              <button
                type="button"
                disabled={updating}
                onClick={() => {
                  setShowRejectModal(
                    false
                  );

                  setRejectionReason(
                    ""
                  );
                }}
                className="px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  updating ||
                  !rejectionReason.trim()
                }
                onClick={
                  handleConfirmReject
                }
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >

                <XCircle size={18} />

                {updating
                  ? "Rejecting..."
                  : "Confirm Rejection"}

              </button>

            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-white/10 mt-10 py-6">

        <p className="text-center text-sm text-slate-600">
          © {new Date().getFullYear()} SecureClaim Insurance Management System
        </p>

      </footer>

    </div>
  );
};

export default AdminClaimReview;