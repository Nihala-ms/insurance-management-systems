import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  getUserClaims,
  getUserPolicies,
} from "../../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [userPolicies, setUserPolicies] = useState([]);
  const [userClaims, setUserClaims] = useState([]);

  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(true);

  // Get logged-in user ID
  const userId = user?.id || user?._id;

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/Auth");
  };

  // =========================
  // FETCH USER POLICIES
  // =========================
  const fetchUserPolicies = async () => {
    if (!userId) return;

    try {
      setLoadingPolicies(true);

      const policyData = await getUserPolicies(userId);

      console.log("USER POLICIES:", policyData);

      setUserPolicies(
        Array.isArray(policyData)
          ? policyData
          : policyData?.userPolicies || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch user policies:",
        error
      );

      setUserPolicies([]);
    } finally {
      setLoadingPolicies(false);
    }
  };

  // =========================
  // FETCH USER CLAIMS
  // =========================
  const fetchUserClaims = async () => {
    if (!userId) return;

    try {
      setLoadingClaims(true);

      const claimData = await getUserClaims(userId);

      console.log("USER CLAIMS:", claimData);

      setUserClaims(
        Array.isArray(claimData)
          ? claimData
          : claimData?.claims || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch user claims:",
        error
      );

      setUserClaims([]);
    } finally {
      setLoadingClaims(false);
    }
  };

  // =========================
  // FETCH USER DATA
  // =========================
  useEffect(() => {
    if (!userId) {
      navigate("/Auth");
      return;
    }

    // Initial fetch
    fetchUserPolicies();
    fetchUserClaims();

    // -------------------------------------------------
    // Refresh policy status automatically
    // This allows the user to see admin approval/rejection
    // without manually refreshing the page.
    // -------------------------------------------------
    const policyRefreshInterval = setInterval(() => {
      fetchUserPolicies();
    }, 10000);

    return () => {
      clearInterval(policyRefreshInterval);
    };
  }, [userId, navigate]);

  // =========================
  // CLAIM STATISTICS
  // =========================

  const approvedClaims = userClaims.filter(
    (claim) =>
      claim.status?.toLowerCase() === "approved"
  ).length;

  const pendingClaims = userClaims.filter(
    (claim) =>
      claim.status?.toLowerCase() === "pending"
  ).length;

  const rejectedClaims = userClaims.filter(
    (claim) =>
      claim.status?.toLowerCase() === "rejected"
  ).length;

  // =========================
  // POLICY STATISTICS
  // =========================

  const activePolicies = userPolicies.filter(
    (policy) =>
      policy.status?.toLowerCase() === "active"
  ).length;

  const pendingPolicies = userPolicies.filter(
    (policy) =>
      policy.status?.toLowerCase() === "pending"
  ).length;

  const rejectedPolicies = userPolicies.filter(
    (policy) =>
      policy.status?.toLowerCase() === "rejected"
  ).length;

  // =========================
  // RECENT CLAIMS
  // =========================

  const recentClaims = [...userClaims]
    .sort((a, b) => {
      return (
        new Date(
          b.createdAt ||
            b.updatedAt ||
            b.incidentDate ||
            0
        ) -
        new Date(
          a.createdAt ||
            a.updatedAt ||
            a.incidentDate ||
            0
        )
      );
    })
    .slice(0, 4);

  // =========================
  // RECENT POLICIES
  // =========================

  const recentPolicies = [...userPolicies]
    .sort((a, b) => {
      return (
        new Date(
          b.createdAt ||
            b.updatedAt ||
            0
        ) -
        new Date(
          a.createdAt ||
            a.updatedAt ||
            0
        )
      );
    })
    .slice(0, 4);

  // =========================
  // DATE FORMAT
  // =========================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const formattedDate = new Date(date);

    if (isNaN(formattedDate.getTime())) {
      return "Date unavailable";
    }

    return formattedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // CLAIM STATUS STYLE
  // =========================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      case "under review":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "expired":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";

      case "cancelled":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";

      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  // =========================
  // POLICY STATUS TEXT
  // =========================

  const getPolicyStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "Approved & Active";

      case "pending":
        return "Pending Review";

      case "rejected":
        return "Rejected";

      case "expired":
        return "Expired";

      case "cancelled":
        return "Cancelled";

      default:
        return status || "Pending";
    }
  };

  // =========================
  // POLICY ICON
  // =========================

  const getPolicyIcon = (policyType) => {
    switch (policyType?.toLowerCase()) {
      case "health":
        return "🏥";

      case "vehicle":
        return "🚗";

      case "home":
        return "🏠";

      case "life":
        return "❤️";

      default:
        return "🛡️";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-md sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/dashboard">
            <h1 className="text-2xl font-bold">
              <span className="text-white">Secure</span>
              <span className="text-blue-500">Claim</span>
            </h1>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-7 text-sm">

            <Link
              to="/dashboard"
              className="text-blue-400 font-medium"
            >
              Dashboard
            </Link>

            <Link
              to="/claims"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              Claims
            </Link>

            <Link
              to="/policies"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              Policies
            </Link>

          </div>

          {/* Right */}
          <div className="flex items-center gap-5">

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition text-sm">
            
              Logout
            </button>

            <Link to="/profile">

              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="Profile"
                className="w-10 h-10 rounded-full border border-gray-700 hover:border-blue-500 transition"
              />

            </Link>

          </div>

        </div>

      </nav>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ===================================================
            WELCOME
        =================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 rounded-3xl p-8 md:p-10">

          {/* Decorative glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10">

            <p className="text-blue-100 text-sm font-medium mb-3">
              Welcome back
            </p>

            <h1 className="text-3xl md:text-4xl font-bold">
              {user?.fullName || "User"} 👋
            </h1>

            <p className="mt-3 text-blue-100 max-w-xl">
              Manage your insurance policies, submit claims and track your
              claim status from your dashboard.
            </p>

            <div className="flex flex-wrap gap-4 mt-7">

              <Link
                to="/newclaim"
                className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition"
              >
                + New Claim
              </Link>

              <Link
                to="/policies"
                className="inline-flex items-center justify-center border border-white/40 hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition"
              >
                View Policies
              </Link>

            </div>

          </div>

        </section>

        {/* ===================================================
            POLICY NOTIFICATION
        =================================================== */}

        {!loadingPolicies && pendingPolicies > 0 && (
          <section className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">

            <div className="flex items-start gap-4">

              <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center text-xl flex-shrink-0">
                ⏳
              </div>

              <div>

                <h3 className="font-semibold text-yellow-400">
                  Policy application under review
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {pendingPolicies === 1
                    ? "Your policy application is currently being reviewed by the admin."
                    : `You have ${pendingPolicies} policy applications waiting for admin review.`}
                </p>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            POLICY REJECTION NOTIFICATION
        =================================================== */}

        {!loadingPolicies && rejectedPolicies > 0 && (
          <section className="mt-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-5">

            <div className="flex items-start gap-4">

              <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-xl flex-shrink-0">
                !
              </div>

              <div>

                <h3 className="font-semibold text-red-400">
                  Policy application update
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  One or more of your policy applications
                  have been rejected. Check your policy
                  applications below for the admin's reason.
                </p>

              </div>

            </div>

          </section>
        )}

        {/* ===================================================
            STAT CARDS
        =================================================== */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

          {/* Policies */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/40 transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  My Policies
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {loadingPolicies ? "..." : userPolicies.length}
                </h2>

                {!loadingPolicies && (
                  <p className="text-xs text-gray-600 mt-1">
                    {activePolicies} active
                  </p>
                )}

              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                🛡️
              </div>

            </div>

          </div>

          {/* Claims */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/40 transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Total Claims
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {loadingClaims ? "..." : userClaims.length}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl">
                📄
              </div>

            </div>

          </div>

          {/* Approved */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-green-500/40 transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Approved
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {loadingClaims ? "..." : approvedClaims}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl">
                ✓
              </div>

            </div>

          </div>

          {/* Pending */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/40 transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Pending
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {loadingClaims ? "..." : pendingClaims}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl">
                ⏳
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            MAIN GRID
        =================================================== */}
        <section className="grid lg:grid-cols-3 gap-8 mt-8">

          {/* =================================================
              LEFT SIDE
          ================================================= */}
          <div className="lg:col-span-2 space-y-8">

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}
            <div className="bg-gray-950 rounded-3xl border border-gray-800 p-6">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-xl font-bold">
                    Quick Actions
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Common actions for your insurance account
                  </p>

                </div>

              </div>

              <div className="grid sm:grid-cols-3 gap-4">

                <Link
                  to="/newclaim"
                  className="group bg-blue-600 hover:bg-blue-700 rounded-2xl p-5 transition"
                >

                  <div className="text-2xl mb-3">
                    📄
                  </div>

                  <h3 className="font-semibold">
                    New Claim
                  </h3>

                  <p className="text-blue-100 text-xs mt-1">
                    Submit a new claim
                  </p>

                </Link>

                <Link
                  to="/claims"
                  className="group bg-black border border-gray-800 hover:border-blue-500 rounded-2xl p-5 transition"
                >

                  <div className="text-2xl mb-3">
                    📊
                  </div>

                  <h3 className="font-semibold">
                    Track Claims
                  </h3>

                  <p className="text-gray-500 text-xs mt-1">
                    View claim progress
                  </p>

                </Link>

                <Link
                  to="/policies"
                  className="group bg-black border border-gray-800 hover:border-blue-500 rounded-2xl p-5 transition"
                >

                  <div className="text-2xl mb-3">
                    🛡️
                  </div>

                  <h3 className="font-semibold">
                    Buy Policies
                  </h3>

                  <p className="text-gray-500 text-xs mt-1">
                    Explore available policies
                  </p>

                </Link>

              </div>

            </div>

            {/* =================================================
                MY POLICY APPLICATIONS
            ================================================= */}
            <div className="bg-gray-950 rounded-3xl border border-gray-800 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-bold">
                    My Policy Applications
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Track your policy applications and approval status
                  </p>

                </div>

                <Link
                  to="/policies"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View Policies →
                </Link>

              </div>

              <div className="space-y-4 mt-6">

                {/* Loading */}
                {loadingPolicies && (
                  <div className="py-10 text-center">

                    <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />

                    <p className="text-gray-500 text-sm mt-3">
                      Loading policies...
                    </p>

                  </div>
                )}

                {/* Empty */}
                {!loadingPolicies &&
                  recentPolicies.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-gray-800 rounded-2xl">

                      <div className="text-4xl">
                        🛡️
                      </div>

                      <h3 className="font-semibold mt-3">
                        No policy applications yet
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        You haven't applied for any insurance policies.
                      </p>

                      <Link
                        to="/policies"
                        className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl text-sm font-medium"
                      >
                        Explore Policies
                      </Link>

                    </div>
                  )}

                {/* Recent policies */}
                {!loadingPolicies &&
                  recentPolicies.map((userPolicy) => {

                    const policyName =
                      userPolicy.policy?.policyName ||
                      userPolicy.policy?.name ||
                      "Insurance Policy";

                    const policyType =
                      userPolicy.policy?.policyType ||
                      "";

                    const status =
                      userPolicy.status || "Pending";

                    return (
                      <div
                        key={userPolicy._id}
                        className="bg-black border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition"
                      >

                        <div className="flex flex-col gap-4">

                          {/* Top row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                            <div className="flex items-start gap-4">

                              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl flex-shrink-0">
                                {getPolicyIcon(policyType)}
                              </div>

                              <div>

                                <h3 className="font-semibold">
                                  {policyName}
                                </h3>

                                <p className="text-blue-400 text-sm mt-1 font-medium">
                                  Policy No:{" "}
                                  {userPolicy.policyNumber ||
                                    "Not available"}
                                </p>

                                <p className="text-gray-500 text-xs mt-1">
                                  Applied on{" "}
                                  {formatDate(
                                    userPolicy.createdAt ||
                                      userPolicy.startDate
                                  )}
                                </p>

                              </div>

                            </div>

                            {/* Status */}
                            <span
                              className={`self-start sm:self-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusStyle(
                                status
                              )}`}
                            >
                              {getPolicyStatusText(status)}
                            </span>

                          </div>

                          {/* =================================================
                              PENDING MESSAGE
                          ================================================= */}
                          {status.toLowerCase() ===
                            "pending" && (
                            <div className="border-t border-gray-800 pt-4">

                              <div className="flex items-start gap-3">

                                <span className="text-yellow-400">
                                  ⏳
                                </span>

                                <div>

                                  <p className="text-yellow-400 text-sm font-medium">
                                    Application is under review
                                  </p>

                                  <p className="text-gray-500 text-xs mt-1">
                                    Your application has been submitted
                                    successfully and is waiting for admin
                                    approval.
                                  </p>

                                </div>

                              </div>

                            </div>
                          )}

                          {/* =================================================
                              APPROVED MESSAGE
                          ================================================= */}
                          {status.toLowerCase() ===
                            "active" && (
                            <div className="border-t border-gray-800 pt-4">

                              <div className="flex items-start gap-3">

                                <span className="text-green-400">
                                  ✓
                                </span>

                                <div className="flex-1">

                                  <p className="text-green-400 text-sm font-medium">
                                    Policy approved successfully
                                  </p>

                                  <p className="text-gray-500 text-xs mt-1">
                                    Your policy is now active.
                                  </p>

                                  <div className="grid sm:grid-cols-2 gap-4 mt-4">

                                    <div>
                                      <p className="text-gray-600 text-xs">
                                        Start Date
                                      </p>

                                      <p className="text-gray-300 text-sm mt-1">
                                        {formatDate(
                                          userPolicy.startDate
                                        )}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-gray-600 text-xs">
                                        End Date
                                      </p>

                                      <p className="text-gray-300 text-sm mt-1">
                                        {formatDate(
                                          userPolicy.endDate
                                        )}
                                      </p>
                                    </div>

                                  </div>

                                </div>

                              </div>

                            </div>
                          )}

                          {/* =================================================
                              REJECTED MESSAGE
                          ================================================= */}
                          {status.toLowerCase() ===
                            "rejected" && (
                            <div className="border-t border-gray-800 pt-4">

                              <div className="flex items-start gap-3">

                                <span className="text-red-400">
                                  !
                                </span>

                                <div>

                                  <p className="text-red-400 text-sm font-medium">
                                    Policy application rejected
                                  </p>

                                  {userPolicy.adminRemarks ? (
                                    <div className="mt-2">

                                      <p className="text-gray-600 text-xs">
                                        Reason from admin
                                      </p>

                                      <p className="text-gray-400 text-sm mt-1">
                                        {userPolicy.adminRemarks}
                                      </p>

                                    </div>
                                  ) : (
                                    <p className="text-gray-500 text-xs mt-1">
                                      No rejection reason was provided.
                                    </p>
                                  )}

                                </div>

                              </div>

                            </div>
                          )}

                        </div>

                      </div>
                    );
                  })}

              </div>

            </div>

            {/* =================================================
                RECENT CLAIMS
            ================================================= */}
            <div className="bg-gray-950 rounded-3xl border border-gray-800 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-bold">
                    Recent Claims
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Your latest insurance claims
                  </p>

                </div>

                <Link
                  to="/claims"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View All →
                </Link>

              </div>

              <div className="space-y-4 mt-6">

                {/* Loading */}
                {loadingClaims && (
                  <div className="py-10 text-center">

                    <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />

                    <p className="text-gray-500 text-sm mt-3">
                      Loading claims...
                    </p>

                  </div>
                )}

                {/* Empty */}
                {!loadingClaims &&
                  recentClaims.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-gray-800 rounded-2xl">

                      <div className="text-4xl">
                        📄
                      </div>

                      <h3 className="font-semibold mt-3">
                        No claims yet
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        You haven't submitted any claims.
                      </p>

                      <Link
                        to="/newclaim"
                        className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl text-sm font-medium"
                      >
                        Submit Your First Claim
                      </Link>

                    </div>
                  )}

                {/* Recent claims */}
                {!loadingClaims &&
                  recentClaims.map((claim) => (

                    <div
                      key={claim._id}
                      className="bg-black border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition"
                    >

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                        <div className="flex items-start gap-4">

                          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl flex-shrink-0">
                            {claim.claimType?.toLowerCase() ===
                            "vehicle"
                              ? "🚗"
                              : claim.claimType?.toLowerCase() ===
                                "health"
                              ? "🏥"
                              : "📄"}
                          </div>

                          <div>

                            <h3 className="font-semibold">
                              {claim.claimType ||
                                "Insurance Claim"}
                            </h3>

                            {/* IMPORTANT:
                                Display claimNumber, NOT _id
                            */}
                            <p className="text-blue-400 text-sm mt-1 font-medium">
                              Claim ID:{" "}
                              {claim.claimNumber ||
                                "Not available"}
                            </p>

                            <p className="text-gray-500 text-xs mt-1">
                              Submitted on{" "}
                              {formatDate(
                                claim.createdAt ||
                                  claim.incidentDate
                              )}
                            </p>

                          </div>

                        </div>

                        <span
                          className={`self-start sm:self-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusStyle(
                            claim.status
                          )}`}
                        >
                          {claim.status || "Pending"}
                        </span>

                      </div>

                    </div>

                  ))}

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}
          <div>

            <div className="bg-gray-950 rounded-3xl border border-gray-800 p-7">

              <div className="text-center">

                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto border-4 border-blue-500/30"
                />

                <h2 className="text-xl font-bold mt-5">
                  {user?.fullName || "User"}
                </h2>

                <p className="text-blue-400 text-sm mt-1">
                  Insurance Member
                </p>

                <p className="text-gray-500 text-sm mt-3 break-all">
                  {user?.email || ""}
                </p>

                <button
                  onClick={() => navigate("/profile")}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-medium transition"
                >
                  View Profile
                </button>

              </div>

              {/* =================================================
                  ACCOUNT SUMMARY
              ================================================= */}
              <div className="border-t border-gray-800 mt-7 pt-6">

                <h3 className="font-semibold mb-4">
                  Account Summary
                </h3>

                <div className="space-y-4">

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Policies
                    </span>

                    <span className="font-medium">
                      {loadingPolicies
                        ? "..."
                        : userPolicies.length}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Active Policies
                    </span>

                    <span className="text-green-400 font-medium">
                      {loadingPolicies
                        ? "..."
                        : activePolicies}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Pending Policies
                    </span>

                    <span className="text-yellow-400 font-medium">
                      {loadingPolicies
                        ? "..."
                        : pendingPolicies}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Rejected Policies
                    </span>

                    <span className="text-red-400 font-medium">
                      {loadingPolicies
                        ? "..."
                        : rejectedPolicies}
                    </span>

                  </div>

                  <div className="border-t border-gray-800 pt-4 flex justify-between text-sm">

                    <span className="text-gray-500">
                      Total Claims
                    </span>

                    <span className="font-medium">
                      {loadingClaims
                        ? "..."
                        : userClaims.length}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Approved Claims
                    </span>

                    <span className="text-green-400 font-medium">
                      {loadingClaims
                        ? "..."
                        : approvedClaims}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Pending Claims
                    </span>

                    <span className="text-yellow-400 font-medium">
                      {loadingClaims
                        ? "..."
                        : pendingClaims}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;