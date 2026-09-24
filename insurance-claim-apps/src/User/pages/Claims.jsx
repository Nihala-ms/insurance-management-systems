import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserClaims } from "../../services/api";

function Claims() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      navigate("/Auth");
      return;
    }

    const fetchClaims = async () => {
      try {
        const data = await getUserClaims(user.id);

        setClaims(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [user?.id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading claims...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-4xl font-bold">
              My Claims
            </h1>

            <p className="text-gray-400 mt-2">
              Track and manage your insurance claims.
            </p>
          </div>

          <button
            onClick={() => navigate("/newclaim")}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl"
          >
            + New Claim
          </button>

        </div>

        {/* No Claims */}
        {claims.length === 0 ? (

          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-10 text-center">

            <h2 className="text-2xl font-bold">
              No Claims Found
            </h2>

            <p className="text-gray-400 mt-3">
              You have not submitted any insurance claims yet.
            </p>

            <button
              onClick={() => navigate("/newclaim")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
            >
              Submit Your First Claim
            </button>

          </div>

        ) : (

          <div className="space-y-5">

            {claims.map((claim) => (

              <div
                key={claim._id}
                className="bg-gray-950 border border-gray-800 rounded-2xl p-6"
              >

                {/* Claim Details */}
                <div className="flex flex-col md:flex-row justify-between gap-5">

                  <div>

                    <p className="text-blue-400 font-semibold">
                      {claim.claimNumber}
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                      {claim.claimType}
                    </h2>

                    <p className="text-gray-400 mt-2">
                      Policy:{" "}
                      {claim.userPolicy?.policy?.policyName ||
                        "Insurance Policy"}
                    </p>

                    <p className="text-gray-400">
                      Incident Date:{" "}
                      {new Date(
                        claim.incidentDate
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  {/* Amount + Status */}
                  <div className="text-right">

                    <p className="text-xl font-bold">
                      ${claim.claimAmount}
                    </p>

                    <span
                      className={`inline-block mt-3 px-4 py-2 rounded-full text-sm ${
                        claim.status === "Approved"
                          ? "bg-green-900 text-green-300"
                          : claim.status === "Rejected"
                          ? "bg-red-900 text-red-300"
                          : "bg-yellow-900 text-yellow-300"
                      }`}
                    >
                      {claim.status}
                    </span>

                  </div>

                </div>

                {/* Claim Description */}
                <div className="border-t border-gray-800 mt-5 pt-5">

                  <p className="text-gray-300">
                    {claim.description}
                  </p>

                </div>

                {/* Rejection Reason */}
                {claim.status === "Rejected" &&
                  claim.adminRemarks && (
                    <div className="mt-5 p-5 rounded-xl bg-red-950/40 border border-red-800/60">

                      <div className="flex items-start gap-3">

                        <div className="text-red-400 text-xl">
                          ⚠
                        </div>

                        <div>
                          <h3 className="text-red-300 font-semibold text-lg">
                            Claim Rejected
                          </h3>

                          <p className="text-gray-300 mt-2">
                            <span className="text-red-400 font-medium">
                              Reason:
                            </span>{" "}
                            {claim.adminRemarks}
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                {/* Approved Message */}
                {claim.status === "Approved" && (
                  <div className="mt-5 p-5 rounded-xl bg-green-950/40 border border-green-800/60">

                    <h3 className="text-green-300 font-semibold text-lg">
                      ✓ Claim Approved
                    </h3>

                    <p className="text-gray-400 mt-1">
                      Your insurance claim has been approved by the
                      administrator.
                    </p>

                  </div>
                )}

                {/* Under Review Message */}
                {claim.status === "Under Review" && (
                  <div className="mt-5 p-5 rounded-xl bg-yellow-950/40 border border-yellow-800/60">

                    <h3 className="text-yellow-300 font-semibold text-lg">
                      ⏳ Claim Under Review
                    </h3>

                    <p className="text-gray-400 mt-1">
                      Your claim is currently being reviewed by the
                      administrator.
                    </p>

                  </div>
                )}

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
}

export default Claims;
