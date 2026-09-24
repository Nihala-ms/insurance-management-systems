import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllPolicies,
  createPolicy,
  updatePolicy,
  togglePolicyStatus,
} from "../../services/api";

function AdminPolicies() {
  const navigate = useNavigate();

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);

  // =====================================================
  // FORM DATA
  // =====================================================

  const initialFormData = {
    policyName: "",
    policyType: "Health",
    description: "",
    premiumAmount: "",
    coverageAmount: "",
    duration: 1,
  };

  const [formData, setFormData] = useState(initialFormData);

  // =====================================================
  // FETCH POLICIES
  // =====================================================

  const fetchPolicies = async () => {
    try {
      setLoading(true);

      const data = await getAllPolicies();

      console.log("GET ALL POLICIES RESPONSE:", data);

      if (Array.isArray(data)) {
        setPolicies(data);
      } else if (Array.isArray(data?.policies)) {
        setPolicies(data.policies);
      } else {
        setPolicies([]);
      }
    } catch (error) {
      console.error("FETCH POLICIES ERROR:", error);

      alert(
        error.message || "Failed to fetch policies"
      );

      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SCROLL TO FORM
  // =====================================================

  const scrollToForm = () => {
    setTimeout(() => {
      const formElement =
        document.getElementById("policy-form");

      if (formElement) {
        formElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddPolicy = () => {
    setEditingPolicy(null);

    setFormData({
      ...initialFormData,
    });

    setShowForm(true);

    scrollToForm();
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEdit = (policy) => {
    console.log("EDIT CLICKED");
    console.log("SELECTED POLICY:", policy);

    setEditingPolicy(policy);

    setFormData({
      policyName: policy.policyName || "",
      policyType: policy.policyType || "Health",
      description: policy.description || "",
      premiumAmount: policy.premiumAmount ?? "",
      coverageAmount: policy.coverageAmount ?? "",
      duration: policy.duration ?? 1,
    });

    setShowForm(true);

    scrollToForm();
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingPolicy(null);
    setFormData({
      ...initialFormData,
    });
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    try {
      // =================================================
      // CLEAN FORM VALUES
      // =================================================

      const policyName =
        formData.policyName?.trim() || "";

      const description =
        formData.description?.trim() || "";

      const policyType =
        formData.policyType || "Health";

      const premiumAmount =
        Number(formData.premiumAmount);

      const coverageAmount =
        Number(formData.coverageAmount);

      const duration =
        Number(formData.duration);

      // =================================================
      // VALIDATION
      // =================================================

      if (!policyName) {
        alert("Policy name is required");
        return;
      }

      if (!description) {
        alert("Policy description is required");
        return;
      }

      if (
        !Number.isFinite(premiumAmount) ||
        premiumAmount <= 0
      ) {
        alert("Enter a valid premium amount");
        return;
      }

      if (
        !Number.isFinite(coverageAmount) ||
        coverageAmount <= 0
      ) {
        alert("Enter a valid coverage amount");
        return;
      }

      if (
        !Number.isFinite(duration) ||
        duration <= 0
      ) {
        alert("Enter a valid duration");
        return;
      }

      // =================================================
      // POLICY DATA
      // =================================================

      const policyData = {
        policyName,
        policyType,
        description,
        premiumAmount,
        coverageAmount,
        duration,
      };

      console.log(
        "================================="
      );

      console.log(
        "POLICY DATA BEING SENT:"
      );

      console.log(policyData);

      console.log(
        "================================="
      );

      setSaving(true);

      // =================================================
      // UPDATE POLICY
      // =================================================

      if (editingPolicy) {
        console.log(
          "UPDATING POLICY:",
          editingPolicy._id
        );

        const result = await updatePolicy(
          editingPolicy._id,
          policyData
        );

        console.log(
          "UPDATE POLICY RESPONSE:",
          result
        );

        alert("Policy updated successfully");
      }

      // =================================================
      // CREATE POLICY
      // =================================================

      else {
        console.log(
          "CREATING NEW POLICY..."
        );

        const result = await createPolicy(
          policyData
        );

        console.log(
          "CREATE POLICY RESPONSE:",
          result
        );

        alert("Policy added successfully");
      }

      // =================================================
      // CLOSE FORM
      // =================================================

      setShowForm(false);
      setEditingPolicy(null);

      setFormData({
        ...initialFormData,
      });

      // =================================================
      // REFRESH POLICIES
      // =================================================

      await fetchPolicies();

    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "POLICY SUBMIT ERROR:",
        error
      );

      console.error(
        "================================="
      );

      alert(
        error.message ||
        "Failed to save policy. Please try again."
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // ACTIVATE / DEACTIVATE
  // =====================================================

  const handleToggleStatus = async (policy) => {
    if (saving) {
      return;
    }

    const isActive =
      policy.status === "Active";

    const action = isActive
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${policy.policyName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      console.log(
        "CHANGING POLICY STATUS:",
        policy._id
      );

      const result =
        await togglePolicyStatus(
          policy._id,
          isActive
            ? "Inactive"
            : "Active"
        );

      console.log(
        "STATUS UPDATE RESPONSE:",
        result
      );

      alert(
        `Policy ${action}d successfully`
      );

      await fetchPolicies();

    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      alert(
        error.message ||
        "Failed to update policy status"
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          Loading policies...
        </p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-10">

          <div>

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="text-gray-400 hover:text-white mb-4 transition"
            >
              ← Back to Dashboard
            </button>

            <h1 className="text-4xl md:text-5xl font-bold">
              Policy Management
            </h1>

            <p className="text-gray-400 mt-3">
              Add, edit and manage insurance policies.
            </p>

          </div>

          <button
            type="button"
            onClick={handleAddPolicy}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700
            disabled:opacity-50
            disabled:cursor-not-allowed
            px-6 py-3 rounded-xl font-semibold
            transition"
          >
            + Add Policy
          </button>

        </div>

        {/* =================================================
            POLICY FORM
        ================================================= */}

        {showForm && (

          <div
            id="policy-form"
            className={`rounded-3xl p-7 md:p-8 mb-10
              scroll-mt-6
              transition-all duration-500
              ${
                editingPolicy
                  ? "bg-gray-950 border border-blue-500/60 shadow-[0_0_45px_rgba(59,130,246,0.18)]"
                  : "bg-gray-950 border border-gray-800"
              }`}
          >

            {/* =================================================
                FORM HEADER
            ================================================= */}

            <div className="flex justify-between items-start mb-7">

              <div>

                <h2
                  className={`text-2xl md:text-3xl font-bold ${
                    editingPolicy
                      ? "text-blue-400"
                      : "text-white"
                  }`}
                >
                  {editingPolicy
                    ? "✏️ Edit Policy"
                    : "➕ Add New Policy"}
                </h2>

                {editingPolicy ? (

                  <div className="mt-2">

                    <p className="text-gray-400">
                      Update the details of this insurance policy.
                    </p>

                    <p className="text-blue-400 text-sm mt-2 font-medium">
                      Editing:{" "}
                      {editingPolicy.policyName}
                    </p>

                  </div>

                ) : (

                  <p className="text-gray-500 mt-2">
                    Enter the insurance policy details below.
                  </p>

                )}

              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="text-gray-400
                hover:text-white
                disabled:opacity-50
                text-3xl
                leading-none
                transition"
                aria-label="Close form"
              >
                ×
              </button>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >

              {/* =================================================
                  POLICY NAME
              ================================================= */}

              <div>

                <label className="block text-gray-300 mb-2">
                  Policy Name
                </label>

                <input
                  type="text"
                  name="policyName"
                  value={formData.policyName}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="e.g. Secure Health Plus"
                  className="w-full bg-black border border-gray-700
                  rounded-xl px-4 py-3 text-white
                  placeholder-gray-600
                  focus:outline-none focus:border-blue-500
                  disabled:opacity-50"
                />

              </div>

              {/* =================================================
                  POLICY TYPE
              ================================================= */}

              <div>

                <label className="block text-gray-300 mb-2">
                  Policy Type
                </label>

                <select
                  name="policyType"
                  value={formData.policyType}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full bg-black border border-gray-700
                  rounded-xl px-4 py-3 text-white
                  focus:outline-none focus:border-blue-500
                  disabled:opacity-50"
                >

                  <option value="Health">
                    Health Insurance
                  </option>

                  <option value="Vehicle">
                    Vehicle Insurance
                  </option>

                  <option value="Life">
                    Life Insurance
                  </option>

                  <option value="Home">
                    Home Insurance
                  </option>

                </select>

              </div>

              {/* =================================================
                  POLICY NUMBER
              ================================================= */}

              {editingPolicy && (

                <div>

                  <label className="block text-gray-300 mb-2">
                    Policy Number
                  </label>

                  <div
                    className="w-full bg-gray-900
                    border border-gray-700
                    rounded-xl px-4 py-3
                    text-gray-400"
                  >
                    {editingPolicy.policyNumber ||
                      "Not available"}
                  </div>

                  <p className="text-xs text-gray-600 mt-2">
                    Policy number is generated automatically.
                  </p>

                </div>

              )}

              {/* =================================================
                  DURATION
              ================================================= */}

              <div>

                <label className="block text-gray-300 mb-2">
                  Duration (Years)
                </label>

                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="e.g. 1"
                  className="w-full bg-black border border-gray-700
                  rounded-xl px-4 py-3 text-white
                  placeholder-gray-600
                  focus:outline-none focus:border-blue-500
                  disabled:opacity-50"
                />

              </div>

              {/* =================================================
                  PREMIUM
              ================================================= */}

              <div>

                <label className="block text-gray-300 mb-2">
                  Premium Amount (₹)
                </label>

                <input
                  type="number"
                  name="premiumAmount"
                  min="1"
                  value={formData.premiumAmount}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="e.g. 12000"
                  className="w-full bg-black border border-gray-700
                  rounded-xl px-4 py-3 text-white
                  placeholder-gray-600
                  focus:outline-none focus:border-blue-500
                  disabled:opacity-50"
                />

              </div>

              {/* =================================================
                  COVERAGE
              ================================================= */}

              <div>

                <label className="block text-gray-300 mb-2">
                  Coverage Amount (₹)
                </label>

                <input
                  type="number"
                  name="coverageAmount"
                  min="1"
                  value={formData.coverageAmount}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="e.g. 500000"
                  className="w-full bg-black border border-gray-700
                  rounded-xl px-4 py-3 text-white
                  placeholder-gray-600
                  focus:outline-none focus:border-blue-500
                  disabled:opacity-50"
                />

              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div className="md:col-span-2">

                <label className="block text-gray-300 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={saving}
                  rows="4"
                  placeholder="Explain the policy coverage, benefits and important terms..."
                  className="w-full bg-black border border-gray-700
                  rounded-xl px-4 py-3 text-white
                  placeholder-gray-600
                  focus:outline-none focus:border-blue-500
                  resize-none
                  disabled:opacity-50"
                />

              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="md:col-span-2 flex flex-wrap gap-4">

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600
                  hover:bg-blue-700
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  px-7 py-3
                  rounded-xl
                  font-semibold
                  transition
                  shadow-lg shadow-blue-900/20"
                >
                  {saving
                    ? "Saving..."
                    : editingPolicy
                    ? "✓ Update Policy"
                    : "+ Add Policy"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="bg-gray-800
                  hover:bg-gray-700
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  px-7 py-3
                  rounded-xl
                  font-semibold
                  transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* =================================================
            POLICY LIST
        ================================================= */}

        {policies.length === 0 ? (

          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-12 text-center">

            <div className="text-6xl mb-5">
              🛡️
            </div>

            <h2 className="text-2xl font-bold">
              No Policies Found
            </h2>

            <p className="text-gray-400 mt-3">
              Start by adding your first insurance policy.
            </p>

            <button
              type="button"
              onClick={handleAddPolicy}
              disabled={saving}
              className="mt-6 bg-blue-600
              hover:bg-blue-700
              disabled:opacity-50
              px-6 py-3
              rounded-xl"
            >
              + Add First Policy
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {policies.map((policy) => (

              <div
                key={policy._id}
                className="bg-gray-950
                border border-gray-800
                rounded-3xl p-6
                hover:border-gray-700
                transition"
              >

                {/* =================================================
                    TOP
                ================================================= */}

                <div className="flex justify-between items-start gap-4">

                  <div>

                    <div className="text-4xl mb-4">

                      {policy.policyType === "Health" &&
                        "🏥"}

                      {policy.policyType === "Vehicle" &&
                        "🚗"}

                      {policy.policyType === "Life" &&
                        "🛡️"}

                      {policy.policyType === "Home" &&
                        "🏠"}

                    </div>

                    <h2 className="text-2xl font-bold">
                      {policy.policyName}
                    </h2>

                    <p className="text-blue-400 mt-1">
                      {policy.policyType} Insurance
                    </p>

                  </div>

                  {/* STATUS */}

                  <span
                    className={`px-3 py-1.5
                    rounded-full
                    text-sm font-medium
                    ${
                      policy.status === "Active"
                        ? "bg-green-900/50 text-green-300"
                        : "bg-red-900/50 text-red-300"
                    }`}
                  >
                    {policy.status || "Inactive"}
                  </span>

                </div>

                {/* =================================================
                    POLICY NUMBER
                ================================================= */}

                <div className="mt-5">

                  <p className="text-gray-500 text-sm">
                    Policy Number
                  </p>

                  <p className="text-gray-200 mt-1 font-medium">
                    {policy.policyNumber ||
                      "Generating..."}
                  </p>

                </div>

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <p className="text-gray-400 mt-5 leading-6">
                  {policy.description}
                </p>

                {/* =================================================
                    DETAILS
                ================================================= */}

                <div className="grid grid-cols-3 gap-3 mt-6">

                  {/* PREMIUM */}

                  <div className="bg-black rounded-xl p-4">

                    <p className="text-gray-500 text-xs">
                      Premium
                    </p>

                    <p className="font-semibold mt-1">
                      ₹
                      {Number(
                        policy.premiumAmount || 0
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                  {/* COVERAGE */}

                  <div className="bg-black rounded-xl p-4">

                    <p className="text-gray-500 text-xs">
                      Coverage
                    </p>

                    <p className="font-semibold mt-1">
                      ₹
                      {Number(
                        policy.coverageAmount || 0
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                  {/* DURATION */}

                  <div className="bg-black rounded-xl p-4">

                    <p className="text-gray-500 text-xs">
                      Duration
                    </p>

                    <p className="font-semibold mt-1">
                      {policy.duration}{" "}
                      {Number(policy.duration) === 1
                        ? "Year"
                        : "Years"}
                    </p>

                  </div>

                </div>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="flex gap-3 mt-6">

                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() => handleEdit(policy)}
                    disabled={saving}
                    className="flex-1
                    bg-gray-800
                    hover:bg-gray-700
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    py-3
                    rounded-xl
                    font-medium
                    transition"
                  >
                    ✏️ Edit
                  </button>

                  {/* ACTIVATE / DEACTIVATE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleStatus(policy)
                    }
                    disabled={saving}
                    className={`flex-1
                    py-3
                    rounded-xl
                    font-medium
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    ${
                      policy.status === "Active"
                        ? "bg-red-900/50 hover:bg-red-900 text-red-300"
                        : "bg-green-900/50 hover:bg-green-900 text-green-300"
                    }`}
                  >
                    {policy.status === "Active"
                      ? "🔴 Deactivate"
                      : "🟢 Activate"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminPolicies;
