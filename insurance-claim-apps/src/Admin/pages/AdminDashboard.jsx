import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getAdminStats,
  getAllClaims,
  getAllUserPolicies,
} from "../../services/api";


function AdminDashboard() {

  const navigate = useNavigate();


  // =========================================
  // USER
  // =========================================

  const [user, setUser] = useState(null);


  // =========================================
  // DASHBOARD STATS
  // =========================================

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPolicies: 0,
    totalClaims: 0,
    pendingClaims: 0,
    recentUsers: [],
    recentPolicies: [],
  });


  // =========================================
  // CLAIMS
  // =========================================

  const [claims, setClaims] = useState([]);

  const [loading, setLoading] = useState(true);

  const [claimsLoading, setClaimsLoading] =
    useState(true);


  // =========================================
  // USER POLICIES
  // =========================================

  const [userPolicies, setUserPolicies] =
    useState([]);

  const [userPoliciesLoading, setUserPoliciesLoading] =
    useState(true);


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/Auth");
  };


  // =========================================
  // SCROLL TO SECTION
  // =========================================

  const scrollToSection = (sectionId) => {

    const section =
      document.getElementById(sectionId);

    if (section) {

      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    }

  };


  // =========================================
  // CHECK ADMIN LOGIN
  // =========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");


    if (!storedUser) {

      navigate("/Auth");

      return;
    }


    try {

      const parsedUser =
        JSON.parse(storedUser);


      setUser(parsedUser);


      if (
        parsedUser.role !== "admin"
      ) {

        alert("Access denied");

        navigate("/dashboard");

        return;
      }

    } catch (error) {

      console.error(
        "Invalid user data:",
        error
      );

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      navigate("/Auth");
    }

  }, [navigate]);


  // =========================================
  // FETCH DASHBOARD STATS
  // =========================================

  const fetchStats = async () => {

    try {

      setLoading(true);


      const response =
        await getAdminStats();


      console.log(
        "ADMIN STATS RESPONSE:",
        response
      );


      const data =
        response?.data ||
        response ||
        {};


      // =========================================
      // LATEST REGISTERED USERS
      // =========================================

      let recentUsers = [];


      if (
        Array.isArray(
          data.recentUsers
        )
      ) {

        recentUsers =
          [...data.recentUsers];

      } else if (
        Array.isArray(
          data.users
        )
      ) {

        recentUsers =
          [...data.users];

      } else if (
        Array.isArray(
          data.data?.recentUsers
        )
      ) {

        recentUsers =
          [...data.data.recentUsers];

      }


      // Show only normal users, not admins
      recentUsers =
        recentUsers.filter(
          (user) =>
            String(user.role)
              .toLowerCase() === "user"
        );


      // Sort latest registered users first
      recentUsers.sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ).getTime() -
          new Date(
            a.createdAt || 0
          ).getTime()
      );


      // Show only latest 2 users
      recentUsers =
        recentUsers.slice(0, 2);


      // =========================================
      // LATEST UPDATED POLICIES
      // =========================================

      let recentPolicies = [];


      if (
        Array.isArray(
          data.recentPolicies
        )
      ) {

        recentPolicies =
          [...data.recentPolicies];

      } else if (
        Array.isArray(
          data.policies
        )
      ) {

        recentPolicies =
          [...data.policies];

      } else if (
        Array.isArray(
          data.data?.recentPolicies
        )
      ) {

        recentPolicies =
          [...data.data.recentPolicies];

      }


      recentPolicies.sort(
        (a, b) =>
          new Date(
            b.updatedAt ||
            b.createdAt ||
            0
          ).getTime() -
          new Date(
            a.updatedAt ||
            a.createdAt ||
            0
          ).getTime()
      );


      recentPolicies =
        recentPolicies.slice(0, 2);


      console.log(
        "LATEST REGISTERED USERS:",
        recentUsers
      );


      console.log(
        "LATEST UPDATED POLICIES:",
        recentPolicies
      );


      // =========================================
      // SET DASHBOARD DATA
      // =========================================

      setStats({

        totalUsers:
          Number(
            data.totalUsers
          ) || 0,

        totalPolicies:
          Number(
            data.totalPolicies
          ) || 0,

        totalClaims:
          Number(
            data.totalClaims
          ) || 0,

        pendingClaims:
          Number(
            data.pendingClaims
          ) || 0,

        recentUsers,

        recentPolicies,

      });


    } catch (error) {

      console.error(
        "Failed to load admin statistics:",
        error
      );


      setStats(
        (previous) => ({
          ...previous,
          recentUsers: [],
          recentPolicies: [],
        })
      );


    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // FETCH ALL CLAIMS
  // =========================================

  const fetchClaims = async () => {

    try {

      setClaimsLoading(true);


      const response =
        await getAllClaims();


      console.log(
        "ALL CLAIMS RESPONSE:",
        response
      );


      let claimsData = [];


      if (
        Array.isArray(response)
      ) {

        claimsData =
          [...response];

      } else if (
        Array.isArray(
          response?.data
        )
      ) {

        claimsData =
          [...response.data];

      } else if (
        Array.isArray(
          response?.claims
        )
      ) {

        claimsData =
          [...response.claims];

      } else if (
        Array.isArray(
          response?.data?.claims
        )
      ) {

        claimsData =
          [...response.data.claims];

      }


      // =========================================
      // LATEST CLAIMS FIRST
      // =========================================

      claimsData.sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ).getTime() -
          new Date(
            a.createdAt || 0
          ).getTime()
      );


      setClaims(
        claimsData
      );


      // =========================================
      // CALCULATE PENDING CLAIMS
      // =========================================

      setStats(
        (previous) => {

          const totalClaims =
            claimsData.length;


          const pendingClaims =
            claimsData.filter(
              (claim) =>
                String(
                  claim.status ||
                  "Pending"
                ).toLowerCase() ===
                "pending"
            ).length;


          return {

            ...previous,

            totalClaims:
              previous.totalClaims > 0
                ? previous.totalClaims
                : totalClaims,

            pendingClaims:
              previous.pendingClaims > 0
                ? previous.pendingClaims
                : pendingClaims,

          };

        }
      );


    } catch (error) {

      console.error(
        "Failed to load claims:",
        error
      );

      setClaims([]);

    } finally {

      setClaimsLoading(false);

    }

  };


  // =========================================
  // FETCH ALL USER POLICIES
  // =========================================

  const fetchUserPolicies = async () => {

    try {

      setUserPoliciesLoading(true);


      const response =
        await getAllUserPolicies();


      console.log(
        "ALL USER POLICIES:",
        response
      );


      let policiesData = [];


      if (
        Array.isArray(response)
      ) {

        policiesData =
          [...response];

      } else if (
        Array.isArray(
          response?.userPolicies
        )
      ) {

        policiesData =
          [...response.userPolicies];

      } else if (
        Array.isArray(
          response?.data
        )
      ) {

        policiesData =
          [...response.data];

      } else if (
        Array.isArray(
          response?.data?.userPolicies
        )
      ) {

        policiesData =
          [...response.data.userPolicies];

      }


      // =========================================
      // LATEST APPLICATIONS FIRST
      // =========================================

      policiesData.sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ).getTime() -
          new Date(
            a.createdAt || 0
          ).getTime()
      );


      setUserPolicies(
        policiesData
      );


    } catch (error) {

      console.error(
        "Failed to fetch user policies:",
        error
      );

      setUserPolicies([]);

    } finally {

      setUserPoliciesLoading(false);

    }

  };


  // =========================================
  // LOAD DASHBOARD
  // =========================================

  useEffect(() => {

    if (
      !user ||
      user.role !== "admin"
    ) {

      return;
    }


    fetchStats();

    fetchClaims();

    fetchUserPolicies();

  }, [user]);


  // =========================================
  // REFRESH EVERYTHING
  // =========================================

  const handleRefresh = async () => {

    await Promise.all([
      fetchStats(),
      fetchClaims(),
      fetchUserPolicies(),
    ]);

  };


  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {

    if (!date) {

      return "N/A";
    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return "N/A";
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


  // =========================================
  // POLICY STATUS
  // =========================================

  const getPolicyStatus = (
    userPolicy
  ) => {

    return (
      userPolicy?.status ||
      "Pending"
    );

  };


  // =========================================
  // POLICY STATUS STYLE
  // =========================================

  const getPolicyStatusStyle = (
    status
  ) => {

    const normalizedStatus =
      String(status)
        .toLowerCase()
        .trim();


    if (
      normalizedStatus ===
        "active" ||
      normalizedStatus ===
        "approved"
    ) {

      return "bg-green-600/20 text-green-400 border border-green-500/30";
    }


    if (
      normalizedStatus ===
        "pending" ||
      normalizedStatus ===
        "under review"
    ) {

      return "bg-yellow-600/20 text-yellow-400 border border-yellow-500/30";
    }


    if (
      normalizedStatus ===
      "rejected"
    ) {

      return "bg-red-600/20 text-red-400 border border-red-500/30";
    }


    if (
      normalizedStatus ===
      "expired"
    ) {

      return "bg-gray-600/20 text-gray-400 border border-gray-500/30";
    }


    if (
      normalizedStatus ===
      "cancelled"
    ) {

      return "bg-orange-600/20 text-orange-400 border border-orange-500/30";
    }


    return "bg-gray-700 text-gray-300";

  };


  // =========================================
  // PENDING POLICY APPLICATIONS
  // =========================================

  const pendingPolicyApplications =
    userPolicies.filter(
      (userPolicy) => {

        const status =
          String(
            userPolicy?.status ||
            "Pending"
          )
            .toLowerCase()
            .trim();


        return (
          status ===
            "pending" ||
          status ===
            "under review"
        );

      }
    );


  // =========================================
  // TOTAL POLICY APPLICATIONS
  // =========================================

  const totalPolicyApplications =
    userPolicies.length;


  // =========================================
  // LOADING SCREEN
  // =========================================

  if (!user) {

    return (

      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">

        <div className="text-center">

          <div className="text-4xl mb-4">
            ⏳
          </div>

          <p className="text-gray-400">
            Loading admin dashboard...
          </p>

        </div>

      </div>

    );

  }


  // =========================================
  // DASHBOARD
  // =========================================

  return (

    <div className="min-h-screen bg-gray-950 text-white">


      {/* =====================================
          NAVBAR
      ====================================== */}

{/* =====================================
    NAVBAR
====================================== */}

<nav className="sticky top-0 z-50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 px-6 lg:px-10 py-5 border-b border-gray-800 bg-black">

  {/* LOGO / HEADER */}

  <div>

    <h1 className="text-3xl font-bold text-blue-500">
      SecureClaim Admin
    </h1>

    <p className="text-sm text-gray-400">
      Insurance Management System
    </p>

  </div>


  {/* NAVIGATION */}

  <div className="flex flex-wrap items-center gap-4 lg:gap-5">

    {/* DASHBOARD */}

    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      className="text-blue-400 hover:text-blue-300 transition"
    >
      Dashboard
    </button>


    {/* CLAIMS */}

    <button
      type="button"
      onClick={() =>
        scrollToSection("recent-claims")
      }
      className="hover:text-blue-400 transition"
    >
      Claims
    </button>


    {/* USERS */}

    <button
      type="button"
      onClick={() =>
        scrollToSection("recent-users")
      }
      className="hover:text-blue-400 transition"
    >
      Users
    </button>


    {/* POLICIES */}

    <Link
      to="/admin-policies"
      className="hover:text-blue-400 transition"
    >
      Policies
    </Link>


    {/* APPLICATIONS */}

    <button
      type="button"
      onClick={() =>
        scrollToSection(
          "policy-applications"
        )
      }
      className="hover:text-blue-400 transition"
    >
      Applications
    </button>


    {/* LOGOUT */}

    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition"
    >
      Logout
    </button>

  </div>

</nav>
      {/* =====================================
          MAIN
      ====================================== */}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">


        {/* =====================================
            WELCOME
        ====================================== */}

        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-7 lg:p-10 shadow-xl">

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

            <div>

              <h1 className="text-3xl lg:text-4xl font-bold">

                Welcome,{" "}

                {user?.fullName ||
                  user?.name ||
                  "Admin"}

                {" "}👋

              </h1>


              <p className="text-blue-100 mt-3 text-lg">

                Monitor users, policies and claims
                in real time.

              </p>

            </div>


            <button
              onClick={handleRefresh}
              className="bg-white text-blue-700 hover:bg-gray-100 px-5 py-3 rounded-xl font-semibold transition"
            >

              ↻ Refresh Dashboard

            </button>

          </div>

        </div>


        {/* =====================================
            STATISTICS
        ====================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mt-10">


          {/* USERS */}

          <div className="bg-gray-900 rounded-3xl p-7 border border-gray-800 hover:border-blue-500 duration-300">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Total Users
                </p>

                <h2 className="text-4xl font-bold mt-3 text-blue-400">

                  {loading
                    ? "..."
                    : stats.totalUsers}

                </h2>

              </div>

              <div className="text-4xl">
                👥
              </div>

            </div>

            <p className="text-gray-500 text-sm mt-5">
              Registered users
            </p>

          </div>


          {/* POLICIES */}

          <div className="bg-gray-900 rounded-3xl p-7 border border-gray-800 hover:border-green-500 duration-300">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Available Policies
                </p>

                <h2 className="text-4xl font-bold mt-3 text-green-400">

                  {loading
                    ? "..."
                    : stats.totalPolicies}

                </h2>

              </div>

              <div className="text-4xl">
                🛡️
              </div>

            </div>

            <p className="text-gray-500 text-sm mt-5">
              Insurance products
            </p>

          </div>


          {/* POLICY APPLICATIONS */}

          <div className="bg-gray-900 rounded-3xl p-7 border border-gray-800 hover:border-cyan-500 duration-300">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Policy Applications
                </p>

                <h2 className="text-4xl font-bold mt-3 text-cyan-400">

                  {userPoliciesLoading
                    ? "..."
                    : totalPolicyApplications}

                </h2>

              </div>

              <div className="text-4xl">
                📝
              </div>

            </div>

            <p className="text-gray-500 text-sm mt-5">
              Customer applications
            </p>

          </div>


          {/* CLAIMS */}

          <div className="bg-gray-900 rounded-3xl p-7 border border-gray-800 hover:border-yellow-500 duration-300">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Total Claims
                </p>

                <h2 className="text-4xl font-bold mt-3 text-yellow-400">

                  {loading
                    ? "..."
                    : stats.totalClaims}

                </h2>

              </div>

              <div className="text-4xl">
                📄
              </div>

            </div>

            <p className="text-gray-500 text-sm mt-5">
              Claims submitted
            </p>

          </div>


          {/* PENDING APPLICATIONS */}

          <div className="bg-gray-900 rounded-3xl p-7 border border-yellow-700/40 hover:border-yellow-500 duration-300">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400">
                  Pending Applications
                </p>

                <h2 className="text-4xl font-bold mt-3 text-yellow-400">

                  {userPoliciesLoading
                    ? "..."
                    : pendingPolicyApplications.length}

                </h2>

              </div>

              <div className="text-4xl">
                ⏳
              </div>

            </div>

            <p className="text-gray-500 text-sm mt-5">
              Waiting for admin review
            </p>

          </div>

        </div>


        {/* =====================================
            POLICY APPLICATION ALERT
        ====================================== */}

        {!userPoliciesLoading &&
          pendingPolicyApplications.length > 0 && (

            <div className="mt-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <h3 className="text-lg font-semibold text-yellow-300">

                    ⚠️ Policy applications need review

                  </h3>

                  <p className="text-sm text-yellow-100/70 mt-1">

                    There are{" "}

                    <span className="font-bold text-yellow-300">

                      {pendingPolicyApplications.length}

                    </span>{" "}

                    application
                    {pendingPolicyApplications.length !== 1
                      ? "s"
                      : ""}{" "}

                    waiting for approval.

                  </p>

                </div>


                <Link
                  to={`/admin-user-policies/${pendingPolicyApplications[0]?._id}`}
                  className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-xl font-semibold"
                >

                  Review Now →

                </Link>

              </div>

            </div>

          )}


        {/* =====================================
            RECENT POLICY APPLICATIONS
        ====================================== */}

        <div
          id="policy-applications"
          className="bg-gray-900 rounded-3xl border border-gray-800 mt-10 p-6 lg:p-8 scroll-mt-6"
        >

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

            <div>

              <h2 className="text-3xl font-bold">
                Recent Policy Applications
              </h2>

              <p className="text-gray-500 mt-1">
                Review insurance applications submitted by customers
              </p>

            </div>


            <button
              onClick={fetchUserPolicies}
              disabled={userPoliciesLoading}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-5 py-2 rounded-xl"
            >

              {userPoliciesLoading
                ? "Refreshing..."
                : "↻ Refresh"}

            </button>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>

                <tr className="text-gray-400 border-b border-gray-700">

                  <th className="text-left py-4">
                    Customer
                  </th>

                  <th className="text-left">
                    Policy
                  </th>

                  <th className="text-left">
                    Policy Number
                  </th>

                  <th className="text-left">
                    Submitted
                  </th>

                  <th className="text-left">
                    Status
                  </th>

                  <th className="text-left">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {userPoliciesLoading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-400"
                    >
                      Loading policy applications...
                    </td>

                  </tr>

                ) : userPolicies.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-10"
                    >

                      <div className="text-4xl mb-3">
                        🛡️
                      </div>

                      <p className="text-gray-400">
                        No policy applications found.
                      </p>

                    </td>

                  </tr>

                ) : (

                  userPolicies
                    .slice(0, 7)
                    .map((userPolicy) => {

                      const customer =
                        userPolicy.user ||
                        {};


                      const policy =
                        userPolicy.policy ||
                        {};


                      const customerName =
                        userPolicy.personalDetails
                          ?.fullName ||
                        customer.fullName ||
                        customer.name ||
                        "N/A";


                      const customerEmail =
                        userPolicy.personalDetails
                          ?.email ||
                        customer.email ||
                        "No email";


                      const policyName =
                        policy.policyName ||
                        "N/A";


                      const policyNumber =
                        userPolicy.policyNumber ||
                        "N/A";


                      const status =
                        getPolicyStatus(
                          userPolicy
                        );


                      const normalizedStatus =
                        String(status)
                          .toLowerCase()
                          .trim();


                      const isPending =
                        normalizedStatus ===
                          "pending" ||
                        normalizedStatus ===
                          "under review";


                      return (

                        <tr
                          key={
                            userPolicy._id
                          }
                          className={`border-b border-gray-800 transition ${
                            isPending
                              ? "bg-yellow-500/5 hover:bg-yellow-500/10"
                              : "hover:bg-gray-800"
                          }`}
                        >

                          <td className="py-5">

                            <div>

                              <p className="font-semibold">
                                {customerName}
                              </p>

                              <p className="text-gray-500 text-sm">
                                {customerEmail}
                              </p>

                            </div>

                          </td>


                          <td>

                            <p className="font-medium">
                              {policyName}
                            </p>

                            <p className="text-gray-500 text-xs mt-1">
                              {policy.policyType ||
                                "Insurance"}
                            </p>

                          </td>


                          <td>

                            <span className="text-blue-400 font-mono text-sm">
                              {policyNumber}
                            </span>

                          </td>


                          <td>

                            {formatDate(
                              userPolicy.createdAt
                            )}

                          </td>


                          <td>

                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPolicyStatusStyle(
                                status
                              )}`}
                            >

                              {status}

                            </span>

                          </td>


                          <td>

                            <Link
                              to={`/admin-user-policies/${userPolicy._id}`}
                              className={`inline-block px-4 py-2 rounded-lg font-medium transition ${
                                isPending
                                  ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                            >

                              {isPending
                                ? "Review"
                                : "View Details"}

                            </Link>

                          </td>

                        </tr>

                      );

                    })

                )}

              </tbody>

            </table>

          </div>


          {userPolicies.length > 7 && (

            <div className="mt-6 text-center">

              <Link
                to="/admin-user-policies"
                className="text-blue-400 hover:text-blue-300"
              >
                View All Policy Applications →
              </Link>

            </div>

          )}

        </div>


        {/* =====================================
            RECENT CLAIMS
        ====================================== */}

        <div
          id="recent-claims"
          className="bg-gray-900 rounded-3xl border border-gray-800 mt-10 p-6 lg:p-8 scroll-mt-6"
        >

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

            <div>

              <h2 className="text-3xl font-bold">
                Recent Claims
              </h2>

              <p className="text-gray-500 mt-1">
                Latest claims submitted by users
              </p>

            </div>


            <div className="flex gap-3">

              <button
                onClick={fetchClaims}
                disabled={claimsLoading}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-5 py-2 rounded-xl"
              >

                {claimsLoading
                  ? "Refreshing..."
                  : "↻ Refresh"}

              </button>


              <Link
                to="/admin-claims"
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl"
              >
                View All
              </Link>

            </div>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px]">

              <thead>

                <tr className="text-gray-400 border-b border-gray-700">

                  <th className="text-left py-4">
                    Policy
                  </th>

                  <th className="text-left">
                    User
                  </th>

                  <th className="text-left">
                    Amount
                  </th>

                  <th className="text-left">
                    Status
                  </th>

                  <th className="text-left">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {claimsLoading ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-400"
                    >
                      Loading claims...
                    </td>

                  </tr>

                ) : claims.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-10"
                    >

                      <div className="text-4xl mb-3">
                        📄
                      </div>

                      <p className="text-gray-400">
                        No Claims Found
                      </p>

                    </td>

                  </tr>

                ) : (

                  claims
                    .slice(0, 5)
                    .map((claim) => {

                      const policyName =
                        claim.userPolicy?.policy?.policyName ||
                        claim.userPolicy?.policyName ||
                        claim.policy?.policyName ||
                        claim.policyName ||
                        "N/A";


                      const userName =
                        claim.user?.fullName ||
                        claim.user?.name ||
                        claim.fullName ||
                        claim.name ||
                        "N/A";


                      const amount =
                        claim.claimAmount ??
                        claim.amount ??
                        0;


                      const status =
                        claim.status ||
                        "Pending";


                      const normalizedStatus =
                        String(status)
                          .toLowerCase()
                          .trim();


                      return (

                        <tr
                          key={claim._id}
                          className="border-b border-gray-800 hover:bg-gray-800 transition"
                        >

                          <td className="py-5">
                            {policyName}
                          </td>


                          <td>
                            {userName}
                          </td>


                          <td>

                            ₹
                            {Number(
                              amount
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </td>


                          <td>

                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                normalizedStatus ===
                                  "approved"
                                  ? "bg-green-600/20 text-green-400 border border-green-500/30"
                                  : normalizedStatus ===
                                    "rejected"
                                  ? "bg-red-600/20 text-red-400 border border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              }`}
                            >

                              {status}

                            </span>

                          </td>


                          <td>

                            <Link
                              to={`/admin-claims/${claim._id}`}
                              className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                            >
                              Review
                            </Link>

                          </td>

                        </tr>

                      );

                    })

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =====================================
            USERS & POLICIES
        ====================================== */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">


          {/* RECENT USERS */}

          <div
            id="recent-users"
            className="bg-gray-900 border border-gray-800 rounded-3xl p-8 scroll-mt-6"
          >

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Recent Users
              </h2>

            </div>


            {stats.recentUsers?.length > 0 ? (

              <div className="space-y-5">

                {stats.recentUsers
                  .slice(0, 2)
                  .map((recentUser) => (

                    <div
                      key={
                        recentUser._id
                      }
                      className="flex justify-between items-center bg-black rounded-2xl p-4 border border-gray-800"
                    >

                      <div>

                        <h3 className="font-semibold text-lg">

                          {recentUser.fullName ||
                            recentUser.name ||
                            "User"}

                        </h3>


                        <p className="text-gray-400 text-sm">

                          {recentUser.email ||
                            "No email"}

                        </p>

                      </div>


                      <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">

                        {recentUser.role ||
                          "user"}

                      </span>

                    </div>

                  ))}

              </div>

            ) : (

              <div className="text-center py-8">

                <div className="text-4xl mb-3">
                  👤
                </div>

                <p className="text-gray-400">
                  No recent users found.
                </p>

              </div>

            )}

          </div>


          {/* RECENT POLICIES */}

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Latest Policies
              </h2>

            </div>


            {stats.recentPolicies?.length > 0 ? (

              <div className="space-y-5">

                {stats.recentPolicies
                  .slice(0, 2)
                  .map((policy) => (

                    <div
                      key={
                        policy._id
                      }
                      className="bg-black rounded-2xl border border-gray-800 p-5"
                    >

                      <div className="flex justify-between items-center gap-4">

                        <div>

                          <h3 className="font-semibold text-lg">

                            {policy.policyName ||
                              "Insurance Policy"}

                          </h3>


                          <p className="text-gray-400">

                            {policy.category ||
                              policy.policyType ||
                              "Insurance"}

                          </p>


                          <p className="text-gray-500 text-sm mt-1">

                            Policy No:{" "}

                            {policy.policyNumber ||
                              "N/A"}

                          </p>


                          <p className="text-gray-500 text-xs mt-1">

                            Last updated:{" "}

                            {formatDate(
                              policy.updatedAt ||
                              policy.createdAt
                            )}

                          </p>

                        </div>


                        <div className="text-right">

                          <p className="text-green-400 font-bold text-lg">

                            ₹
                            {Number(
                              policy.premiumAmount ??
                              policy.premium ??
                              0
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </p>


                          <p className="text-gray-400 text-sm">
                            / year
                          </p>

                        </div>

                      </div>

                    </div>

                  ))}

              </div>

            ) : (

              <div className="text-center py-8">

                <div className="text-4xl mb-3">
                  🛡️
                </div>

                <p className="text-gray-400">
                  No recent policies found.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* =====================================
            QUICK ACTIONS
        ====================================== */}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            Quick Actions
          </h2>


          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">


            {/* CLAIMS */}

            <button
              type="button"
              onClick={() =>
                scrollToSection(
                  "recent-claims"
                )
              }
              className="text-left bg-blue-700 hover:bg-blue-800 rounded-3xl p-8 transition duration-300 shadow-lg"
            >

              <div className="text-5xl mb-4">
                📄
              </div>

              <h3 className="text-2xl font-bold">
                Manage Claims
              </h3>

              <p className="text-blue-100 mt-2">
                Review, approve or reject claims.
              </p>

            </button>


            {/* USERS */}

            <button
              type="button"
              onClick={() =>
                scrollToSection(
                  "recent-users"
                )
              }
              className="text-left bg-green-700 hover:bg-green-800 rounded-3xl p-8 transition duration-300 shadow-lg"
            >

              <div className="text-5xl mb-4">
                👥
              </div>

              <h3 className="text-2xl font-bold">
                Manage Users
              </h3>

              <p className="text-green-100 mt-2">
                View registered customers.
              </p>

            </button>


            {/* POLICY APPLICATIONS */}

            <button
              type="button"
              onClick={() =>
                scrollToSection(
                  "policy-applications"
                )
              }
              className="text-left bg-cyan-700 hover:bg-cyan-800 rounded-3xl p-8 transition duration-300 shadow-lg"
            >

              <div className="text-5xl mb-4">
                📝
              </div>

              <h3 className="text-2xl font-bold">
                Policy Applications
              </h3>

              <p className="text-cyan-100 mt-2">

                {pendingPolicyApplications.length > 0
                  ? `${pendingPolicyApplications.length} application(s) waiting for review.`
                  : "Review customer policy applications."}

              </p>

            </button>


            {/* POLICIES */}

            <Link
              to="/admin-policies"
              className="bg-purple-700 hover:bg-purple-800 rounded-3xl p-8 transition duration-300 shadow-lg"
            >

              <div className="text-5xl mb-4">
                🛡️
              </div>

              <h3 className="text-2xl font-bold">
                Policies
              </h3>

              <p className="text-purple-100 mt-2">
                Add and update insurance policies.
              </p>

            </Link>

          </div>

        </div>


        {/* =====================================
            DASHBOARD SUMMARY
        ====================================== */}

        <div className="grid lg:grid-cols-3 gap-8 mt-10">


          {/* SYSTEM STATUS */}

          <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8">

            <h2 className="text-2xl font-bold mb-6">
              System Status
            </h2>


            <div className="space-y-4">

              <div className="flex justify-between">

                <span>
                  Server
                </span>

                <span className="text-green-400">
                  Online
                </span>

              </div>


              <div className="flex justify-between">

                <span>
                  Database
                </span>

                <span className="text-green-400">
                  Connected
                </span>

              </div>


              <div className="flex justify-between">

                <span>
                  API
                </span>

                <span className="text-green-400">
                  Running
                </span>

              </div>

            </div>

          </div>


          {/* PENDING TASKS */}

          <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8">

            <h2 className="text-2xl font-bold mb-6">
              Pending Tasks
            </h2>


            <ul className="space-y-4 text-gray-300">

              <li>

                • Review{" "}

                {pendingPolicyApplications.length}{" "}

                pending policy application
                {pendingPolicyApplications.length !== 1
                  ? "s"
                  : ""}

              </li>


              <li>

                • Verify{" "}

                {stats.pendingClaims}{" "}

                pending claim
                {stats.pendingClaims !== 1
                  ? "s"
                  : ""}

              </li>


              <li>
                • Review new users
              </li>


              <li>
                • Update policy details
              </li>


              <li>
                • Export monthly report
              </li>

            </ul>

          </div>


          {/* SECURECLAIM */}

          <div className="bg-gradient-to-br from-blue-700 to-indigo-700 rounded-3xl p-8">

            <h2 className="text-3xl font-bold">
              SecureClaim
            </h2>


            <p className="mt-4 text-blue-100">
              Admin Control Center
            </p>


            <Link
              to="/admin-reports"
              className="inline-block mt-8 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200"
            >
              View Analytics
            </Link>

          </div>

        </div>


        {/* =====================================
            FOOTER
        ====================================== */}

        <footer className="mt-16 border-t border-gray-800 pt-8 pb-8 text-center text-gray-500">

          © {new Date().getFullYear()} SecureClaim Insurance Management System

        </footer>


      </div>

    </div>

  );

}


export default AdminDashboard;