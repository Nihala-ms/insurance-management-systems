import React, { useEffect, useState } from "react";

import {
  TrendingUp,
  Users,
  ShieldCheck,
  FileText,
  IndianRupee,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getAdminReports,
  getAllClaims,
  getAllPolicies,
} from "../../services/api";

const AdminReports = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATS
  // =====================================================

  const [stats, setStats] = useState({
    totalUsers: 0,

    totalPolicies: 0,

    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,

    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
  });

  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH REPORTS
  // =====================================================

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        reportsResponse,
        claimsResponse,
        policiesResponse,
      ] = await Promise.all([
        getAdminReports(),
        getAllClaims(),
        getAllPolicies(),
      ]);

      // =================================================
      // ADMIN REPORTS
      // Backend is the source of truth
      // =================================================

      const reportsData =
        reportsResponse?.data ||
        reportsResponse ||
        {};

      console.log(
        "ADMIN REPORT DATA:",
        reportsData
      );

      setStats({
        // USERS
        totalUsers: Number(
          reportsData?.totalUsers ?? 0
        ),

        // POLICIES
        totalPolicies: Number(
          reportsData?.totalPolicies ?? 0
        ),

        // POLICY APPLICATIONS
        totalApplications: Number(
          reportsData?.totalApplications ?? 0
        ),

        pendingApplications: Number(
          reportsData?.pendingApplications ?? 0
        ),

        approvedApplications: Number(
          reportsData?.approvedApplications ?? 0
        ),

        rejectedApplications: Number(
          reportsData?.rejectedApplications ?? 0
        ),

        // CLAIMS
        totalClaims: Number(
          reportsData?.totalClaims ?? 0
        ),

        pendingClaims: Number(
          reportsData?.pendingClaims ?? 0
        ),

        approvedClaims: Number(
          reportsData?.approvedClaims ?? 0
        ),

        rejectedClaims: Number(
          reportsData?.rejectedClaims ?? 0
        ),
      });

      // =================================================
      // CLAIMS
      // Used for claim amount calculations
      // =================================================

      const claimsData =
        claimsResponse?.data?.claims ||
        claimsResponse?.data?.data ||
        claimsResponse?.data ||
        claimsResponse?.claims ||
        claimsResponse ||
        [];

      setClaims(
        Array.isArray(claimsData)
          ? claimsData
          : []
      );

      // =================================================
      // POLICIES
      // Used only for Active / Inactive policy status
      // =================================================

      const policiesData =
        policiesResponse?.data?.policies ||
        policiesResponse?.data?.data ||
        policiesResponse?.data ||
        policiesResponse?.policies ||
        policiesResponse ||
        [];

      setPolicies(
        Array.isArray(policiesData)
          ? policiesData
          : []
      );
    } catch (err) {
      console.error(
        "ADMIN REPORTS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load admin reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // =====================================================
  // CLAIM AMOUNT
  // =====================================================

  const getClaimAmount = (claim) => {
    return Number(
      claim?.claimAmount ??
        claim?.amount ??
        claim?.requestedAmount ??
        0
    );
  };

  const totalClaimAmount = claims.reduce(
    (total, claim) =>
      total + getClaimAmount(claim),
    0
  );

  const approvedClaimAmount = claims
    .filter(
      (claim) =>
        String(claim?.status || "")
          .trim()
          .toLowerCase() === "approved"
    )
    .reduce(
      (total, claim) =>
        total + getClaimAmount(claim),
      0
    );

  // =====================================================
  // POLICY STATUS
  // =====================================================

  const getPolicyStatus = (policy) => {
    return String(
      policy?.status || ""
    )
      .trim()
      .toLowerCase();
  };

  const activePolicies = policies.filter(
    (policy) =>
      getPolicyStatus(policy) === "active"
  ).length;

  const inactivePolicies = policies.filter(
    (policy) =>
      getPolicyStatus(policy) === "inactive"
  ).length;

  // Policies that are neither Active nor Inactive
  // are counted as other statuses.
  const otherPolicies = policies.filter(
    (policy) => {
      const status =
        getPolicyStatus(policy);

      return (
        status !== "active" &&
        status !== "inactive"
      );
    }
  ).length;

  // =====================================================
  // PERCENTAGE
  // =====================================================

  const percentage = (value, total) => {
    if (!total || total <= 0) {
      return 0;
    }

    return Math.round(
      (Number(value) / Number(total)) * 100
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-400">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 text-center max-w-md w-full">
          <XCircle
            size={48}
            className="text-red-400 mx-auto mb-4"
          />

          <h2 className="text-xl font-semibold mb-2">
            Unable to Load Reports
          </h2>

          <p className="text-gray-400 mb-6">
            {error}
          </p>

          <button
            onClick={fetchReports}
            className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-black font-semibold transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div className="flex items-center gap-4">

            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <TrendingUp
                size={28}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Analytics
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                Insurance management system overview
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              navigate("/admin")
            }
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-700 hover:border-cyan-500 hover:text-cyan-400 transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

        </div>

        {/* ================================================= */}
        {/* TOP STAT CARDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* TOTAL USERS */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-4">

              <div className="p-3 rounded-xl bg-blue-500/10">
                <Users
                  size={24}
                  className="text-blue-400"
                />
              </div>

              <span className="text-xs text-gray-500">
                USERS
              </span>

            </div>

            <p className="text-gray-400 text-sm">
              Total Users
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {stats.totalUsers}
            </h2>

            <p className="text-xs text-gray-500 mt-2">
              Registered users
            </p>

          </div>

          {/* TOTAL POLICIES */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-4">

              <div className="p-3 rounded-xl bg-cyan-500/10">
                <ShieldCheck
                  size={24}
                  className="text-cyan-400"
                />
              </div>

              <span className="text-xs text-gray-500">
                POLICIES
              </span>

            </div>

            <p className="text-gray-400 text-sm">
              Total Policies
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {stats.totalPolicies}
            </h2>

            <p className="text-xs text-gray-500 mt-2">
              Insurance products
            </p>

          </div>

          {/* TOTAL CLAIMS */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-4">

              <div className="p-3 rounded-xl bg-purple-500/10">
                <FileText
                  size={24}
                  className="text-purple-400"
                />
              </div>

              <span className="text-xs text-gray-500">
                CLAIMS
              </span>

            </div>

            <p className="text-gray-400 text-sm">
              Total Claims
            </p>

            <h2 className="text-3xl font-bold mt-1">
              {stats.totalClaims}
            </h2>

            <p className="text-xs text-gray-500 mt-2">
              Claims submitted
            </p>

          </div>

          {/* TOTAL CLAIM AMOUNT */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-4">

              <div className="p-3 rounded-xl bg-green-500/10">
                <IndianRupee
                  size={24}
                  className="text-green-400"
                />
              </div>

              <span className="text-xs text-gray-500">
                AMOUNT
              </span>

            </div>

            <p className="text-gray-400 text-sm">
              Total Claim Amount
            </p>

            <h2 className="text-2xl font-bold mt-1">
              ₹
              {totalClaimAmount.toLocaleString(
                "en-IN"
              )}
            </h2>

            <p className="text-xs text-gray-500 mt-2">
              Total requested amount
            </p>

          </div>

        </div>

        {/* ================================================= */}
        {/* CLAIM STATUS + CLAIM AMOUNT */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* CLAIM STATUS */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-6">

              <FileText
                size={22}
                className="text-cyan-400"
              />

              <h2 className="text-lg font-semibold">
                Claim Status
              </h2>

            </div>

            <div className="space-y-6">

              {/* PENDING */}

              <div>

                <div className="flex justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <Clock
                      size={17}
                      className="text-yellow-400"
                    />

                    <span className="text-gray-300">
                      Pending
                    </span>

                  </div>

                  <span className="font-semibold">
                    {stats.pendingClaims}
                  </span>

                </div>

                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${percentage(
                        stats.pendingClaims,
                        stats.totalClaims
                      )}%`,
                    }}
                  />

                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {percentage(
                    stats.pendingClaims,
                    stats.totalClaims
                  )}
                  %
                </p>

              </div>

              {/* APPROVED */}

              <div>

                <div className="flex justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <CheckCircle
                      size={17}
                      className="text-green-400"
                    />

                    <span className="text-gray-300">
                      Approved
                    </span>

                  </div>

                  <span className="font-semibold">
                    {stats.approvedClaims}
                  </span>

                </div>

                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-400 rounded-full"
                    style={{
                      width: `${percentage(
                        stats.approvedClaims,
                        stats.totalClaims
                      )}%`,
                    }}
                  />

                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {percentage(
                    stats.approvedClaims,
                    stats.totalClaims
                  )}
                  %
                </p>

              </div>

              {/* REJECTED */}

              <div>

                <div className="flex justify-between mb-2">

                  <div className="flex items-center gap-2">

                    <XCircle
                      size={17}
                      className="text-red-400"
                    />

                    <span className="text-gray-300">
                      Rejected
                    </span>

                  </div>

                  <span className="font-semibold">
                    {stats.rejectedClaims}
                  </span>

                </div>

                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-red-400 rounded-full"
                    style={{
                      width: `${percentage(
                        stats.rejectedClaims,
                        stats.totalClaims
                      )}%`,
                    }}
                  />

                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {percentage(
                    stats.rejectedClaims,
                    stats.totalClaims
                  )}
                  %
                </p>

              </div>

            </div>
          </div>

          {/* CLAIM AMOUNT */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-6">

              <IndianRupee
                size={22}
                className="text-green-400"
              />

              <h2 className="text-lg font-semibold">
                Claim Amount
              </h2>

            </div>

            <div className="space-y-6">

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">

                <div>

                  <p className="text-sm text-gray-400">
                    Total Requested
                  </p>

                  <p className="text-xl font-bold mt-1">
                    ₹
                    {totalClaimAmount.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

                <FileText
                  size={28}
                  className="text-cyan-400"
                />

              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">

                <div>

                  <p className="text-sm text-gray-400">
                    Approved Amount
                  </p>

                  <p className="text-xl font-bold text-green-400 mt-1">
                    ₹
                    {approvedClaimAmount.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

                <CheckCircle
                  size={28}
                  className="text-green-400"
                />

              </div>

              <div>

                <div className="flex justify-between text-sm mb-2">

                  <span className="text-gray-400">
                    Approved Amount Rate
                  </span>

                  <span>
                    {percentage(
                      approvedClaimAmount,
                      totalClaimAmount
                    )}
                    %
                  </span>

                </div>

                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-400 rounded-full"
                    style={{
                      width: `${percentage(
                        approvedClaimAmount,
                        totalClaimAmount
                      )}%`,
                    }}
                  />

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* ================================================= */}
        {/* POLICY STATUS + APPLICATIONS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* POLICY STATUS */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-6">

              <ShieldCheck
                size={22}
                className="text-cyan-400"
              />

              <h2 className="text-lg font-semibold">
                Policy Status
              </h2>

            </div>

            <div className="flex items-center justify-center py-6">

              <div
                className="relative w-44 h-44 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(
                    #22d3ee ${
                      percentage(
                        activePolicies,
                        stats.totalPolicies
                      ) * 3.6
                    }deg,
                    #374151 ${
                      percentage(
                        activePolicies,
                        stats.totalPolicies
                      ) * 3.6
                    }deg
                  )`,
                }}
              >

                <div className="w-32 h-32 rounded-full bg-gray-900 flex flex-col items-center justify-center">

                  <span className="text-3xl font-bold">
                    {stats.totalPolicies}
                  </span>

                  <span className="text-xs text-gray-500">
                    Total Policies
                  </span>

                </div>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">

              {/* ACTIVE */}

              <div className="bg-gray-800/50 rounded-xl p-4">

                <div className="flex items-center gap-2 mb-2">

                  <span className="w-3 h-3 rounded-full bg-cyan-400"></span>

                  <span className="text-sm text-gray-400">
                    Active
                  </span>

                </div>

                <p className="text-2xl font-bold">
                  {activePolicies}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {percentage(
                    activePolicies,
                    stats.totalPolicies
                  )}
                  %
                </p>

              </div>

              {/* INACTIVE */}

              <div className="bg-gray-800/50 rounded-xl p-4">

                <div className="flex items-center gap-2 mb-2">

                  <span className="w-3 h-3 rounded-full bg-gray-500"></span>

                  <span className="text-sm text-gray-400">
                    Inactive
                  </span>

                </div>

                <p className="text-2xl font-bold">
                  {inactivePolicies}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {percentage(
                    inactivePolicies,
                    stats.totalPolicies
                  )}
                  %
                </p>

              </div>

            </div>

            {/* OTHER POLICY STATUSES */}

            {otherPolicies > 0 && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                {otherPolicies} policies have other
                statuses.
              </p>
            )}

          </div>

          {/* POLICY APPLICATIONS */}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-6">

              <Users
                size={22}
                className="text-purple-400"
              />

              <h2 className="text-lg font-semibold">
                Policy Applications
              </h2>

            </div>

            {/* TOTAL APPLICATIONS */}

            <div className="mb-6 p-4 bg-gray-800/50 rounded-xl">

              <p className="text-sm text-gray-400">
                Total Applications
              </p>

              <p className="text-3xl font-bold mt-1">
                {stats.totalApplications}
              </p>

            </div>

            <div className="space-y-5">

              {/* APPROVED */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-gray-300">
                    Approved
                  </span>

                  <span className="font-semibold">
                    {stats.approvedApplications}
                  </span>

                </div>

                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-400 rounded-full"
                    style={{
                      width: `${percentage(
                        stats.approvedApplications,
                        stats.totalApplications
                      )}%`,
                    }}
                  />

                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {percentage(
                    stats.approvedApplications,
                    stats.totalApplications
                  )}
                  %
                </p>

              </div>

              {/* PENDING */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-gray-300">
                    Pending
                  </span>

                  <span className="font-semibold">
                    {stats.pendingApplications}
                  </span>

                </div>

                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${percentage(
                        stats.pendingApplications,
                        stats.totalApplications
                      )}%`,
                    }}
                  />

                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {percentage(
                    stats.pendingApplications,
                    stats.totalApplications
                  )}
                  %
                </p>

              </div>

              {/* REJECTED */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-gray-300">
                    Rejected
                  </span>

                  <span className="font-semibold">
                    {stats.rejectedApplications}
                  </span>

                </div>

                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-red-400 rounded-full"
                    style={{
                      width: `${percentage(
                        stats.rejectedApplications,
                        stats.totalApplications
                      )}%`,
                    }}
                  />

                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {percentage(
                    stats.rejectedApplications,
                    stats.totalApplications
                  )}
                  %
                </p>

              </div>

            </div>
          </div>

        </div>

        {/* ================================================= */}
        {/* QUICK SUMMARY */}
        {/* ================================================= */}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-6">

            <TrendingUp
              size={22}
              className="text-cyan-400"
            />

            <h2 className="text-lg font-semibold">
              Quick Summary
            </h2>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* CLAIM APPROVAL RATE */}

            <div className="p-4 bg-gray-800/50 rounded-xl">

              <p className="text-sm text-gray-400">
                Claim Approval Rate
              </p>

              <p className="text-2xl font-bold text-green-400 mt-1">
                {percentage(
                  stats.approvedClaims,
                  stats.totalClaims
                )}
                %
              </p>

            </div>

            {/* CLAIM PENDING RATE */}

            <div className="p-4 bg-gray-800/50 rounded-xl">

              <p className="text-sm text-gray-400">
                Claim Pending Rate
              </p>

              <p className="text-2xl font-bold text-yellow-400 mt-1">
                {percentage(
                  stats.pendingClaims,
                  stats.totalClaims
                )}
                %
              </p>

            </div>

            {/* APPLICATION REJECTION RATE */}

            <div className="p-4 bg-gray-800/50 rounded-xl">

              <p className="text-sm text-gray-400">
                Application Rejection Rate
              </p>

              <p className="text-2xl font-bold text-red-400 mt-1">
                {percentage(
                  stats.rejectedApplications,
                  stats.totalApplications
                )}
                %
              </p>

            </div>

            {/* APPROVED CLAIM AMOUNT */}

            <div className="p-4 bg-gray-800/50 rounded-xl">

              <p className="text-sm text-gray-400">
                Approved Claim Amount
              </p>

              <p className="text-xl font-bold text-green-400 mt-1">
                ₹
                {approvedClaimAmount.toLocaleString(
                  "en-IN"
                )}
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminReports;