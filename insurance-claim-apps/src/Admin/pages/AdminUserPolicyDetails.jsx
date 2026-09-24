import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getUserPolicyDetails,
  updateUserPolicyStatus,
} from "../../services/api";

function AdminUserPolicyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userPolicy, setUserPolicy] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const [adminRemarks, setAdminRemarks] =
    useState("");

  // ======================================================
  // CHECK ADMIN
  // ======================================================

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    fetchDetails();
  }, [id]);

  // ======================================================
  // FETCH DETAILS
  // ======================================================

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getUserPolicyDetails(id);

      setUserPolicy(data);

      setAdminRemarks(
        data?.adminRemarks || ""
      );
    } catch (err) {
      console.error(
        "FETCH POLICY DETAILS ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to load policy details"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // APPROVE
  // ======================================================

  const handleApprove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this policy application?"
    );

    if (!confirmed) return;

    try {
      setProcessing(true);

      const admin = JSON.parse(
        localStorage.getItem("user")
      );

      const adminId =
        admin?.id || admin?._id;

      const data =
        await updateUserPolicyStatus(
          id,
          "Active",
          adminRemarks ||
            "Application approved.",
          adminId
        );

      alert(
        data?.message ||
          "Policy approved successfully."
      );

      await fetchDetails();
    } catch (err) {
      console.error(
        "APPROVE POLICY ERROR:",
        err
      );

      alert(
        err.message ||
          "Failed to approve policy"
      );
    } finally {
      setProcessing(false);
    }
  };

  // ======================================================
  // REJECT
  // ======================================================

  const handleReject = async () => {
    if (!adminRemarks.trim()) {
      alert(
        "Please enter a reason before rejecting the application."
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this policy application?"
    );

    if (!confirmed) return;

    try {
      setProcessing(true);

      const admin = JSON.parse(
        localStorage.getItem("user")
      );

      const adminId =
        admin?.id || admin?._id;

      const data =
        await updateUserPolicyStatus(
          id,
          "Rejected",
          adminRemarks,
          adminId
        );

      alert(
        data?.message ||
          "Policy application rejected."
      );

      await fetchDetails();
    } catch (err) {
      console.error(
        "REJECT POLICY ERROR:",
        err
      );

      alert(
        err.message ||
          "Failed to reject policy"
      );
    } finally {
      setProcessing(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-300">
          Loading policy application...
        </p>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() =>
              navigate("/admin")
            }
            className="mb-6 text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">
              Error
            </h2>

            <p className="text-red-300">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!userPolicy) {
    return null;
  }

  const user = userPolicy.user;
  const policy = userPolicy.policy;

  const isPending =
    userPolicy.status === "Pending";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Policy Application Review
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Review customer insurance application
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/admin")
            }
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ==================================================
            APPLICATION STATUS
        ================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-sm text-slate-400">
                Application Number
              </p>

              <h2 className="text-xl font-semibold mt-1">
                {userPolicy.policyNumber}
              </h2>
            </div>

            <div>
              <span
                className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                  userPolicy.status === "Pending"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : userPolicy.status === "Active"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {userPolicy.status}
              </span>
            </div>

          </div>
        </section>

        {/* ==================================================
            CUSTOMER DETAILS
        ================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">
            Customer Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <Info
              label="Full Name"
              value={
                userPolicy.personalDetails
                  ?.fullName
              }
            />

            <Info
              label="Email"
              value={
                userPolicy.personalDetails
                  ?.email
              }
            />

            <Info
              label="Phone"
              value={
                userPolicy.personalDetails
                  ?.phone
              }
            />

            <Info
              label="Date of Birth"
              value={
                userPolicy.personalDetails
                  ?.dateOfBirth
                    ? new Date(
                        userPolicy.personalDetails.dateOfBirth
                      ).toLocaleDateString()
                    : "-"
              }
            />

            <Info
              label="Gender"
              value={
                userPolicy.personalDetails
                  ?.gender
              }
            />

            <Info
              label="Address"
              value={
                userPolicy.personalDetails
                  ?.address
              }
            />

          </div>
        </section>

        {/* ==================================================
            POLICY DETAILS
        ================================================== */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">
            Insurance Policy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            <Info
              label="Policy Name"
              value={policy?.policyName}
            />

            <Info
              label="Policy Number"
              value={userPolicy.basePolicyNumber}
            />

            <Info
              label="Policy Type"
              value={policy?.policyType}
            />

            <Info
              label="Coverage"
              value={
                policy?.coverageAmount
                  ? `₹${Number(
                      policy.coverageAmount
                    ).toLocaleString()}`
                  : "-"
              }
            />

            <Info
              label="Premium"
              value={
                policy?.premium
                  ? `₹${Number(
                      policy.premium
                    ).toLocaleString()}`
                  : "-"
              }
            />

            <Info
              label="Duration"
              value={
                policy?.duration
                  ? `${policy.duration} year(s)`
                  : "-"
              }
            />

            <Info
              label="Application Date"
              value={
                userPolicy.createdAt
                  ? new Date(
                      userPolicy.createdAt
                    ).toLocaleDateString()
                  : "-"
              }
            />

            <Info
              label="Start Date"
              value={
                userPolicy.startDate
                  ? new Date(
                      userPolicy.startDate
                    ).toLocaleDateString()
                  : "-"
              }
            />

          </div>
        </section>

        {/* ==================================================
            HEALTH DETAILS
        ================================================== */}

        {policy?.policyType === "Health" && (
          <DetailSection
            title="Health Information"
            data={userPolicy.healthDetails}
          />
        )}

        {/* ==================================================
            VEHICLE DETAILS
        ================================================== */}

        {policy?.policyType === "Vehicle" && (
          <DetailSection
            title="Vehicle Information"
            data={userPolicy.vehicleDetails}
          />
        )}

        {/* ==================================================
            HOME DETAILS
        ================================================== */}

        {policy?.policyType === "Home" && (
          <DetailSection
            title="Home Information"
            data={userPolicy.homeDetails}
          />
        )}

        {/* ==================================================
            LIFE DETAILS
        ================================================== */}

        {policy?.policyType === "Life" && (
          <DetailSection
            title="Life / Nominee Information"
            data={userPolicy.lifeDetails}
          />
        )}

{/* ==================================================
    DOCUMENTS
================================================== */}

{/* ==================================================
    DOCUMENTS
================================================== */}
<section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
  <h2 className="text-xl font-semibold mb-6">
    Submitted Documents
  </h2>

  {userPolicy.documents &&
  Object.values(userPolicy.documents).some(
    (value) => value
  ) ? (
    <div className="space-y-4">
      {Object.entries(userPolicy.documents).map(
        ([key, value]) => {
          if (!value) return null;

          const documentUrl = value.startsWith("http")
            ? value
            : `http://localhost:3000/${String(value).replace(
                /^\/+/,
                ""
              )}`;

          const lowerValue = String(value).toLowerCase();

          const isImage =
            /\.(jpg|jpeg|png|gif|webp)$/i.test(
              lowerValue
            );

          const isPdf =
            /\.pdf$/i.test(lowerValue);

          return (
            <div
              key={key}
              className="bg-slate-800/70 rounded-xl p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1 capitalize">
                    {key.replace(
                      /([A-Z])/g,
                      " $1"
                    )}
                  </p>

                  <p className="text-white text-sm break-all">
                    {String(value)}
                  </p>
                </div>

                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition"
                >
                  View Document
                </a>
              </div>

              {/* IMAGE PREVIEW */}
              {isImage && (
                <div className="mt-4">
                  <img
                    src={documentUrl}
                    alt={key}
                    className="max-w-full max-h-96 rounded-lg border border-slate-700 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              )}

              {/* PDF PREVIEW */}
              {isPdf && (
                <div className="mt-4">
                  <iframe
                    src={documentUrl}
                    title={key}
                    className="w-full h-[500px] rounded-lg border border-slate-700"
                  />
                </div>
              )}
            </div>
          );
        }
      )}
    </div>
  ) : (
    <p className="text-slate-400">
      No documents submitted.
    </p>
  )}
</section>        {/* ==================================================
            ADMIN REVIEW
        ================================================== */}

        {isPending && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-semibold mb-2">
              Admin Review
            </h2>

            <p className="text-slate-400 text-sm mb-5">
              Review the submitted information before
              approving or rejecting this application.
            </p>

            <label className="block text-sm text-slate-300 mb-2">
              Admin Remarks / Rejection Reason
            </label>

            <textarea
              value={adminRemarks}
              onChange={(e) =>
                setAdminRemarks(
                  e.target.value
                )
              }
              rows={4}
              placeholder="Enter remarks or rejection reason..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
            />

            <div className="flex flex-col sm:flex-row gap-4 mt-6">

              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 font-semibold transition"
              >
                {processing
                  ? "Processing..."
                  : "✓ Approve Application"}
              </button>

              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 font-semibold transition"
              >
                {processing
                  ? "Processing..."
                  : "✕ Reject Application"}
              </button>

            </div>

          </section>
        )}

        {/* ==================================================
            PREVIOUS ADMIN REVIEW
        ================================================== */}

        {!isPending &&
          userPolicy.adminRemarks && (
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-xl font-semibold mb-4">
                Admin Review
              </h2>

              <div className="bg-slate-800/70 rounded-xl p-4">
                <p className="text-slate-300">
                  {userPolicy.adminRemarks}
                </p>
              </div>

              {userPolicy.reviewedAt && (
                <p className="text-sm text-slate-500 mt-3">
                  Reviewed on{" "}
                  {new Date(
                    userPolicy.reviewedAt
                  ).toLocaleString()}
                </p>
              )}

            </section>
          )}

      </main>
    </div>
  );
}

// ======================================================
// INFO COMPONENT
// ======================================================

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-400 mb-1">
        {label}
      </p>

      <p className="text-white break-words">
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// DETAIL SECTION
// ======================================================

function DetailSection({ title, data }) {
  if (!data) return null;

  const entries = Object.entries(data).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== ""
  );

  if (entries.length === 0) return null;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl font-semibold mb-6">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {entries.map(([key, value]) => (
          <Info
            key={key}
            label={key
              .replace(
                /([A-Z])/g,
                " $1"
              )
              .replace(/^./, (str) =>
                str.toUpperCase()
              )}
            value={value}
          />
        ))}

      </div>
    </section>
  );
}

export default AdminUserPolicyDetails;