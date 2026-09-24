import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Eye,
  FileText,
  User,
  Calendar,
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { getAllUserPolicies } from "../../services/api";

function AdminUserPolicies() {
  const navigate = useNavigate();

  const [userPolicies, setUserPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ======================================================
  // CHECK ADMIN LOGIN
  // ======================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== "admin") {
        navigate("/");
        return;
      }

      fetchUserPolicies();
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  // ======================================================
  // FETCH ALL USER POLICIES
  // ======================================================

  const fetchUserPolicies = async () => {
    try {
      setError("");

      const response = await getAllUserPolicies();

      let policies = [];

      if (Array.isArray(response)) {
        policies = response;
      } else if (Array.isArray(response?.userPolicies)) {
        policies = response.userPolicies;
      } else if (Array.isArray(response?.data)) {
        policies = response.data;
      } else if (Array.isArray(response?.data?.userPolicies)) {
        policies = response.data.userPolicies;
      }

      // Only user policy records
      policies = policies.filter((item) => {
        const role =
          item?.user?.role ||
          item?.userId?.role ||
          item?.customer?.role;

        return !role || role === "user";
      });

      // Latest applications first
      policies.sort((a, b) => {
        return (
          new Date(b.createdAt || b.applicationDate || 0) -
          new Date(a.createdAt || a.applicationDate || 0)
        );
      });

      setUserPolicies(policies);
      setFilteredPolicies(policies);
    } catch (err) {
      console.error("Failed to fetch user policies:", err);
      setError(err.message || "Failed to load policy applications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ======================================================
  // REFRESH
  // ======================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserPolicies();
  };

  // ======================================================
  // SEARCH + FILTER
  // ======================================================

  useEffect(() => {
    let result = [...userPolicies];

    // Search
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter((item) => {
        const customerName =
          item?.user?.name ||
          item?.user?.username ||
          item?.user?.fullName ||
          item?.personalDetails?.name ||
          item?.personalDetails?.fullName ||
          "";

        const email =
          item?.user?.email ||
          item?.personalDetails?.email ||
          "";

        const policyName =
          item?.policy?.policyName ||
          item?.policyName ||
          "";

        const policyNumber =
          item?.policy?.policyNumber ||
          item?.policyNumber ||
          "";

        const policyType =
          item?.policy?.policyType ||
          item?.policyType ||
          "";

        return (
          String(customerName).toLowerCase().includes(search) ||
          String(email).toLowerCase().includes(search) ||
          String(policyName).toLowerCase().includes(search) ||
          String(policyNumber).toLowerCase().includes(search) ||
          String(policyType).toLowerCase().includes(search)
        );
      });
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((item) => {
        const status = item?.status || "Pending";

        return (
          String(status).toLowerCase() ===
          statusFilter.toLowerCase()
        );
      });
    }

    setFilteredPolicies(result);
  }, [searchTerm, statusFilter, userPolicies]);

  // ======================================================
  // HELPER FUNCTIONS
  // ======================================================

  const getCustomerName = (item) => {
    return (
      item?.user?.name ||
      item?.user?.username ||
      item?.user?.fullName ||
      item?.personalDetails?.name ||
      item?.personalDetails?.fullName ||
      "Unknown User"
    );
  };

  const getCustomerEmail = (item) => {
    return (
      item?.user?.email ||
      item?.personalDetails?.email ||
      "No email"
    );
  };

  const getPolicyName = (item) => {
    return (
      item?.policy?.policyName ||
      item?.policyName ||
      "Unknown Policy"
    );
  };

  const getPolicyNumber = (item) => {
    return (
      item?.policy?.policyNumber ||
      item?.policyNumber ||
      "N/A"
    );
  };

  const getPolicyType = (item) => {
    return (
      item?.policy?.policyType ||
      item?.policyType ||
      "N/A"
    );
  };

  const getStatus = (item) => {
    return item?.status || "Pending";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status).toLowerCase();

    if (
      normalizedStatus === "approved" ||
      normalizedStatus === "active"
    ) {
      return {
        className:
          "bg-green-500/10 text-green-400 border-green-500/20",
        icon: <CheckCircle size={14} />,
      };
    }

    if (
      normalizedStatus === "rejected" ||
      normalizedStatus === "cancelled"
    ) {
      return {
        className:
          "bg-red-500/10 text-red-400 border-red-500/20",
        icon: <XCircle size={14} />,
      };
    }

    return {
      className:
        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      icon: <Clock size={14} />,
    };
  };

  // ======================================================
  // COUNTS
  // ======================================================

  const totalApplications = userPolicies.length;

  const pendingApplications = userPolicies.filter(
    (item) =>
      String(getStatus(item)).toLowerCase() === "pending"
  ).length;

  const approvedApplications = userPolicies.filter(
    (item) => {
      const status = String(getStatus(item)).toLowerCase();

      return status === "approved" || status === "active";
    }
  ).length;

  const rejectedApplications = userPolicies.filter(
    (item) => {
      const status = String(getStatus(item)).toLowerCase();

      return status === "rejected" || status === "cancelled";
    }
  ).length;

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={40}
            className="animate-spin mx-auto mb-4 text-blue-400"
          />

          <p className="text-gray-400">
            Loading policy applications...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div className="flex items-center gap-4">

              <Link
                to="/admin-dashboard"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                title="Back to Dashboard"
              >
                <ArrowLeft size={20} />
              </Link>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  All Policy Applications
                </h1>

                <p className="text-gray-400 mt-1">
                  View and manage all customer policy applications
                </p>
              </div>

            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

          </div>

        </div>
      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
            {error}
          </div>
        )}

        {/* ==================================================
            STAT CARDS
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Total */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-400 text-sm">
                  Total Applications
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalApplications}
                </h2>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                <FileText size={24} />
              </div>

            </div>
          </div>

          {/* Pending */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-400 text-sm">
                  Pending
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {pendingApplications}
                </h2>
              </div>

              <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400">
                <Clock size={24} />
              </div>

            </div>
          </div>

          {/* Approved */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-400 text-sm">
                  Approved
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {approvedApplications}
                </h2>
              </div>

              <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
                <CheckCircle size={24} />
              </div>

            </div>
          </div>

          {/* Rejected */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-400 text-sm">
                  Rejected
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {rejectedApplications}
                </h2>
              </div>

              <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
                <XCircle size={24} />
              </div>

            </div>
          </div>

        </div>

        {/* ==================================================
            SEARCH + FILTER
        ================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">

          <div className="flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="relative flex-1">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search by customer, email, policy or policy number..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />

            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="text-gray-300">
              {filteredPolicies.length}
            </span>{" "}
            of{" "}
            <span className="text-gray-300">
              {userPolicies.length}
            </span>{" "}
            applications
          </div>

        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <ShieldCheck
                size={22}
                className="text-blue-400"
              />

              <h2 className="text-xl font-semibold">
                Policy Applications
              </h2>
            </div>
          </div>

          {filteredPolicies.length === 0 ? (

            <div className="py-16 text-center">

              <FileText
                size={48}
                className="mx-auto text-gray-600 mb-4"
              />

              <h3 className="text-lg font-semibold text-gray-300">
                No policy applications found
              </h3>

              <p className="text-gray-500 mt-2">
                Try changing your search or status filter.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="bg-slate-800/70">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Customer
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Policy
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Policy Number
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Type
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Applied Date
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Status
                    </th>

                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-400">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800">

                  {filteredPolicies.map((item, index) => {

                    const status = getStatus(item);
                    const statusStyle =
                      getStatusStyle(status);

                    return (
                      <tr
                        key={
                          item?._id ||
                          item?.id ||
                          `policy-${index}`
                        }
                        className="hover:bg-slate-800/40 transition"
                      >

                        {/* Customer */}
                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                              <User size={19} />
                            </div>

                            <div>
                              <p className="font-medium text-white">
                                {getCustomerName(item)}
                              </p>

                              <p className="text-sm text-gray-500">
                                {getCustomerEmail(item)}
                              </p>
                            </div>

                          </div>

                        </td>

                        {/* Policy */}
                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <ShieldCheck
                              size={18}
                              className="text-blue-400"
                            />

                            <span className="text-gray-200">
                              {getPolicyName(item)}
                            </span>

                          </div>

                        </td>

                        {/* Policy Number */}
                        <td className="px-6 py-5">

                          <span className="font-mono text-sm text-gray-300">
                            {getPolicyNumber(item)}
                          </span>

                        </td>

                        {/* Type */}
                        <td className="px-6 py-5">

                          <span className="px-3 py-1 rounded-full bg-slate-800 text-gray-300 text-sm">
                            {getPolicyType(item)}
                          </span>

                        </td>

                        {/* Date */}
                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2 text-gray-400">

                            <Calendar size={16} />

                            <span>
                              {formatDate(
                                item?.createdAt ||
                                item?.applicationDate
                              )}
                            </span>

                          </div>

                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${statusStyle.className}`}
                          >
                            {statusStyle.icon}
                            {status}
                          </span>

                        </td>

                        {/* Action */}
                        <td className="px-6 py-5 text-center">

                          <Link
                            to={`/admin-user-policies/${item?._id}`}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition"
                          >
                            <Eye size={16} />
                            View
                          </Link>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>
    </div>
  );
}

export default AdminUserPolicies;