const API_URL =
  "https://insurance-management-systems-pht3uta6d-nihala-ms-projects.vercel.app/api";
// =====================================================
// HELPER
// =====================================================

const parseResponse = async (response) => {
  const text = await response.text();

  console.log(
    "API STATUS:",
    response.status
  );

  console.log(
    "API RESPONSE:",
    text
  );

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(
      "Server returned an invalid response. Check your backend server."
    );
  }

  return data;
};


// =====================================================
// AUTH
// =====================================================

export const registerUser = async (userData) => {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData),
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Registration failed"
    );
  }

  return data;
};


export const loginUser = async (userData) => {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData),
    }
  );

  const data = await parseResponse(response);

  console.log(
    "Login API response:",
    data
  );

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Login failed"
    );
  }

  return data;
};


// =====================================================
// POLICIES - USER
// =====================================================

export const getPolicies = async () => {
  try {
    const response = await fetch(
      `${API_URL}/policies`
    );

    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to fetch policies"
      );
    }

    return Array.isArray(data)
      ? data
      : data.policies || [];

  } catch (error) {
    console.error(
      "GET POLICIES ERROR:",
      error
    );

    throw error;
  }
};


// =====================================================
// ADD / BUY USER POLICY
// =====================================================

// export const addUserPolicy = async (
//   policyData
// ) => {
//   try {
//     console.log(
//       "===================================="
//     );

//     console.log(
//       "ADD USER POLICY REQUEST:"
//     );

//     console.log(
//       policyData
//     );

//     console.log(
//       "===================================="
//     );

//     const response = await fetch(
//       `${API_URL}/user-policies`,
//       {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify(policyData),
//       }
//     );

//     const data = await parseResponse(
//       response
//     );

//     console.log(
//       "ADD USER POLICY RESPONSE:",
//       data
//     );

//     if (!response.ok) {
//       throw new Error(
//         data.message ||
//           data.error ||
//           `Failed to add policy (${response.status})`
//       );
//     }

//     return data;

//   } catch (error) {
//     console.error(
//       "ADD USER POLICY ERROR:",
//       error
//     );

//     throw error;
//   }
// };


// =====================================================
// GET USER POLICIES
// =====================================================

// export const getUserPolicies = async (
//   userId
// ) => {
//   try {
//     if (!userId) {
//       throw new Error(
//         "User ID is missing"
//       );
//     }

//     console.log(
//       "GET USER POLICIES FOR:",
//       userId
//     );

//     const response = await fetch(
//       `${API_URL}/user-policies/${userId}`
//     );

//     const data = await parseResponse(
//       response
//     );

//     if (!response.ok) {
//       throw new Error(
//         data.message ||
//           data.error ||
//           "Failed to fetch user policies"
//       );
//     }

//     // Backend normally returns an array
//     if (Array.isArray(data)) {
//       return data;
//     }

//     // Extra protection
//     if (
//       Array.isArray(data.userPolicies)
//     ) {
//       return data.userPolicies;
//     }

//     return [];

//   } catch (error) {
//     console.error(
//       "GET USER POLICIES ERROR:",
//       error
//     );

//     throw error;
//   }
// };


// =====================================================
// CLAIM - SUBMIT
// =====================================================

export const submitClaim = async (
  claimData
) => {
  try {
    const response = await fetch(
      `${API_URL}/claims`,
      {
        method: "POST",

        // Do NOT set Content-Type manually
        // because claimData is FormData.
        body: claimData,
      }
    );

    const data = await parseResponse(
      response
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to submit claim"
      );
    }

    return data;

  } catch (error) {
    console.error(
      "SUBMIT CLAIM ERROR:",
      error
    );

    throw error;
  }
};


// =====================================================
// CLAIM - GET USER CLAIMS
// =====================================================

export const getUserClaims = async (
  userId
) => {
  try {
    if (!userId) {
      throw new Error(
        "User ID is missing"
      );
    }

    console.log(
      "GET USER CLAIMS FOR:",
      userId
    );

    const response = await fetch(
      `${API_URL}/claims/user/${userId}`
    );

    const data = await parseResponse(
      response
    );

    console.log(
      "USER CLAIMS RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to fetch claims"
      );
    }

    // Backend returns an array
    if (Array.isArray(data)) {
      return data;
    }

    // Extra protection
    if (Array.isArray(data.claims)) {
      return data.claims;
    }

    return [];

  } catch (error) {
    console.error(
      "GET USER CLAIMS ERROR:",
      error
    );

    throw error;
  }
};


// =====================================================
// ADMIN DASHBOARD
// =====================================================

export const getAdminStats = async () => {
  try {
    const response = await fetch(
      `${API_URL}/admin/dashboard`
    );

    const data = await parseResponse(
      response
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to fetch dashboard"
      );
    }

    return data;

  } catch (error) {
    console.error(
      "GET ADMIN STATS ERROR:",
      error
    );

    throw error;
  }
};


// =====================================================
// GET CLAIM BY ID
// =====================================================

export const getClaimById = async (
  claimId
) => {
  try {
    if (!claimId) {
      throw new Error(
        "Claim ID is missing"
      );
    }

    const response = await fetch(
      `${API_URL}/claims/${claimId}`
    );

    const data = await parseResponse(
      response
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to fetch claim"
      );
    }

    return data;

  } catch (error) {
    console.error(
      "GET CLAIM BY ID ERROR:",
      error
    );

    throw error;
  }
};


// =====================================================
// GET ALL CLAIMS - ADMIN
// =====================================================

export const getAllClaims = async () => {
  try {
    const response = await fetch(
      `${API_URL}/admin/claims`
    );

    const data = await parseResponse(
      response
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to fetch claims"
      );
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.claims)) {
      return data.claims;
    }

    return [];

  } catch (error) {
    console.error(
      "GET ALL CLAIMS ERROR:",
      error
    );

    throw error;
  }
};


// =====================================================
// UPDATE CLAIM STATUS - ADMIN
// =====================================================

export const updateClaimStatus = async (
  claimId,
  status,
  adminRemarks = ""
) => {
  try {
    if (!claimId) {
      throw new Error(
        "Claim ID is missing"
      );
    }

    if (!status) {
      throw new Error(
        "Claim status is required"
      );
    }

    console.log(
      "UPDATE CLAIM STATUS REQUEST:",
      {
        claimId,
        status,
        adminRemarks,
      }
    );

    const response = await fetch(
      `${API_URL}/claims/${claimId}/status`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          status,
          adminRemarks,
        }),
      }
    );

    const data = await parseResponse(
      response
    );

    console.log(
      "UPDATE CLAIM STATUS RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to update claim status"
      );
    }

    return data;

  } catch (error) {
    console.error(
      "UPDATE CLAIM STATUS ERROR:",
      error
    );

    throw error;
  }
};


// =====================================================
// ADMIN POLICY MANAGEMENT
// =====================================================

// GET ALL POLICIES

export const getAllPolicies = async () => {
  try {
    const response = await fetch(
      `${API_URL}/policies`
    );

    const data = await parseResponse(
      response
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to fetch policies"
      );
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.policies)) {
      return data.policies;
    }

    return [];

  } catch (error) {
    console.error(
      "GET ALL POLICIES ERROR:",
      error
    );

    throw error;
  }
};


// =====================================================
// CREATE POLICY - ADMIN
// =====================================================

export const createPolicy = async (
  policyData
) => {
  try {
    console.log(
      "===================================="
    );

    console.log(
      "CREATE POLICY REQUEST:",
      policyData
    );

    console.log(
      "===================================="
    );

    const response = await fetch(
      `${API_URL}/policies`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          policyData
        ),
      }
    );

    const data = await parseResponse(
      response
    );

    console.log(
      "CREATE POLICY RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          `Failed to create policy (${response.status})`
      );
    }

    return data;

  } catch (error) {
    console.error(
      "CREATE POLICY ERROR:",
      error
    );

    throw error;
  }
};


// =====================================================
// UPDATE POLICY - ADMIN
// =====================================================

export const updatePolicy = async (
  policyId,
  policyData
) => {
  try {
    if (!policyId) {
      throw new Error(
        "Policy ID is missing"
      );
    }

    console.log(
      "UPDATE POLICY REQUEST:",
      policyId,
      policyData
    );

    const response = await fetch(
      `${API_URL}/policies/${policyId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          policyData
        ),
      }
    );

    const data = await parseResponse(
      response
    );

    console.log(
      "UPDATE POLICY RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to update policy"
      );
    }

    return data;

  } catch (error) {
    console.error(
      "UPDATE POLICY ERROR:",
      error
    );

    throw error;
  }
};


// =====================================================
// TOGGLE POLICY STATUS - ADMIN
// =====================================================

export const togglePolicyStatus = async (
  policyId,
  status
) => {
  try {
    if (!policyId) {
      throw new Error(
        "Policy ID is missing"
      );
    }

    if (!["Active", "Inactive"].includes(status)) {
      throw new Error(
        "Invalid policy status"
      );
    }

    const response = await fetch(
      `${API_URL}/policies/${policyId}/status`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          status,
        }),
      }
    );

    const data = await parseResponse(
      response
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to update policy status"
      );
    }

    return data;

  } catch (error) {
    console.error(
      "TOGGLE POLICY STATUS ERROR:",
      error
    );

    throw error;
  }
};


// =====================================================
// GET ALL USER POLICIES - ADMIN
// =====================================================
// ======================================================
// USER POLICY APIs
// ======================================================

// ======================================================
// ADD / BUY USER POLICY WITH DOCUMENT UPLOAD
// ======================================================

export const addUserPolicy = async (policyData) => {
  try {
    const formData = new FormData();

    // -------------------------
    // BASIC POLICY INFORMATION
    // -------------------------

    formData.append("userId", policyData.userId);
    formData.append("policyId", policyData.policyId);
    formData.append(
      "policyNumber",
      policyData.policyNumber || ""
    );

    formData.append(
      "startDate",
      policyData.startDate instanceof Date
        ? policyData.startDate.toISOString()
        : policyData.startDate
    );

    formData.append(
      "endDate",
      policyData.endDate instanceof Date
        ? policyData.endDate.toISOString()
        : policyData.endDate
    );

    // -------------------------
    // OBJECT DATA
    // -------------------------

    formData.append(
      "personalDetails",
      JSON.stringify(policyData.personalDetails || {})
    );

    formData.append(
      "vehicleDetails",
      JSON.stringify(policyData.vehicleDetails || {})
    );

    formData.append(
      "healthDetails",
      JSON.stringify(policyData.healthDetails || {})
    );

    formData.append(
      "homeDetails",
      JSON.stringify(policyData.homeDetails || {})
    );

    formData.append(
      "lifeDetails",
      JSON.stringify(policyData.lifeDetails || {})
    );

    // -------------------------
    // DOCUMENT FILES
    // -------------------------

    const documents = policyData.documents || {};

    if (documents.idProof) {
      formData.append(
        "idProof",
        documents.idProof
      );
    }

    if (documents.addressProof) {
      formData.append(
        "addressProof",
        documents.addressProof
      );
    }

    if (documents.medicalCertificate) {
      formData.append(
        "medicalCertificate",
        documents.medicalCertificate
      );
    }

    if (documents.vehicleDocument) {
      formData.append(
        "vehicleDocument",
        documents.vehicleDocument
      );
    }

    if (documents.otherDocument) {
      formData.append(
        "otherDocument",
        documents.otherDocument
      );
    }

    console.log(
      "Submitting policy application with files..."
    );

    const response = await fetch(
      `${API_URL}/user-policies`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await parseResponse(response);

    console.log(
      "ADD USER POLICY RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to submit insurance application"
      );
    }

    return data;

  } catch (error) {
    console.error(
      "ADD USER POLICY ERROR:",
      error
    );

    throw error;
  }
};
// ======================================================
// GET CURRENT USER POLICIES
// ======================================================

export const getUserPolicies = async (userId) => {
  try {
    const response = await fetch(
      `${API_URL}/user-policies/${userId}`
    );

    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to fetch user policies"
      );
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.userPolicies)) {
      return data.userPolicies;
    }

    return [];
  } catch (error) {
    console.error("GET USER POLICIES ERROR:", error);
    throw error;
  }
};

// ======================================================
// ADMIN - GET ALL USER POLICY APPLICATIONS
// ======================================================



// =====================================================
// GET ALL USER POLICY APPLICATIONS - ADMIN
// =====================================================

export const getAllUserPolicies = async () => {
  const response = await fetch(
    `${API_URL}/user-policies`
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Failed to fetch user policies"
    );
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.userPolicies)) {
    return data.userPolicies;
  }

  return [];
};


// =====================================================
// GET SINGLE USER POLICY DETAILS
// =====================================================

export const getUserPolicyDetails = async (userPolicyId) => {
  const response = await fetch(
    `${API_URL}/user-policies/details/${userPolicyId}`
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Failed to fetch policy details"
    );
  }

  return data;
};


// =====================================================
// APPROVE / REJECT USER POLICY
// =====================================================

export const updateUserPolicyStatus = async (
  id,
  status,
  adminRemarks = ""
) => {
  const response = await fetch(
    `${API_URL}/user-policies/${id}/status`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status,
        adminRemarks,
      }),
    }
  );

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Failed to update policy status"
    );
  }

  return data;
};

// =====================================================
// ADMIN REPORTS
// =====================================================

export const getAdminReports = async () => {
  try {
    const response = await fetch(
      `${API_URL}/admin/reports`
    );

    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.error ||
        "Failed to fetch admin reports"
      );
    }

    return data;

  } catch (error) {
    console.error(
      "GET ADMIN REPORTS ERROR:",
      error
    );

    throw error;
  }
};