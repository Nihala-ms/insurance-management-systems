import React, { useEffect, useState } from "react";
import { getPolicies } from "../../services/api";
import { useNavigate } from "react-router-dom";

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await getPolicies();

        setPolicies(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const handleSelectPolicy = (policy) => {
    navigate("/policy-details", {
      state: {
        policy,
      },
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          Loading policies...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400 text-lg">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      {/* Page Header */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Insurance Policies
        </h1>

        <p className="text-gray-400 mt-3">
          Explore and choose the right insurance policy for your needs.
        </p>

      </div>


      {/* No Policies */}
      {policies.length === 0 ? (

        <div className="bg-gray-950 border border-gray-800 rounded-3xl p-10 text-center">

          <p className="text-gray-400">
            No insurance policies are currently available.
          </p>

        </div>

      ) : (

        /* Policy Cards */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {policies.map((policy) => (

            <div
              key={policy._id}
              className="bg-gray-950 border border-gray-800 rounded-3xl p-8 hover:border-blue-500 transition duration-300"
            >

              {/* Policy Icon */}
              <div className="text-5xl">

                {policy.policyType === "Vehicle" && "🚗"}

                {policy.policyType === "Health" && "🏥"}

                {policy.policyType === "Life" && "🛡️"}

                {policy.policyType === "Home" && "🏠"}

              </div>


              {/* Policy Name */}
              <h2 className="text-2xl font-bold mt-5">
                {policy.policyName}
              </h2>


              {/* Policy Type */}
              <p className="text-blue-400 mt-2">
                {policy.policyType} Insurance
              </p>


              {/* Description */}
              <p className="text-gray-400 mt-4 leading-6">
                {policy.description}
              </p>


              {/* Policy Details */}
              <div className="mt-6 space-y-3">

                <p>
                  <span className="text-gray-400">
                    Policy Number:
                  </span>{" "}
                  {policy.policyNumber}
                </p>


                <p>
                  <span className="text-gray-400">
                    Coverage:
                  </span>{" "}
                  ₹{policy.coverageAmount.toLocaleString("en-IN")}
                </p>


                <p>
                  <span className="text-gray-400">
                    Premium:
                  </span>{" "}
                  ₹{policy.premiumAmount.toLocaleString("en-IN")}
                </p>


                <p>
                  <span className="text-gray-400">
                    Duration:
                  </span>{" "}
                  {policy.duration} year
                </p>


                <p>
                  <span className="text-gray-400">
                    Status:
                  </span>{" "}

                  <span className="text-green-400">
                    {policy.status}
                  </span>

                </p>

              </div>


              {/* Select Policy Button */}
              <button
              onClick={()=>handleSelectPolicy(policy)}
                className="w-full mt-7 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition"
              >
                Select Policy
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Policies;