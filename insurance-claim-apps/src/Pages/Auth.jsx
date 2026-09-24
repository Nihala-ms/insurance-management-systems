import React, { useState } from 'react'
import { registerUser,loginUser } from '../services/api'
import { Navigate, useNavigate } from 'react-router-dom';

function Auth() {

  const [showRegister, setShowRegister] = useState(false)
  const [fullName,setFullName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const data = await registerUser({
      fullName,
      email,
      password,
    });

    alert(data.message);

    if (data.message === "Registration successful") {
      setShowRegister(false);

      setFullName("");
      setEmail("");
      setPassword("");
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};


const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const data = await loginUser({
      email,
      password,
    });

    console.log("Data received in Auth.jsx:", data);

    if (data.message === "Login successful") {
  localStorage.setItem("token", data.token);

  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  if (data.user.role === "admin") {
    navigate("/admin");
  } else {
    navigate("/dashboard");
  }
}
  } catch (error) {
    console.log("Login error:", error);
    alert(error.message || "Login failed");
  }
};






  return (
    <div className="bg-black text-white flex flex-col py-10 min-h-screen">

      {/* Auth Section */}
      <section className="flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-gray-950 border border-gray-800 rounded-[30px] overflow-hidden shadow-2xl">

          {/* Left Side */}
          <div className="hidden lg:flex flex-col justify-center p-10 bg-gradient-to-br from-blue-700 to-blue-500 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">

              <h1 className="text-4xl font-bold leading-tight">
                Welcome to
                <br />
                SecureClaim
              </h1>

              <p className="text-blue-100 text-base leading-7 mt-6">
                Manage your insurance policies, submit claims,
                and track approvals securely from anywhere.
              </p>

              {/* Features */}
              <div className="space-y-5 mt-10">

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    🔒
                  </div>

                  <p className="text-base">
                    Secure Account Access
                  </p>

                </div>


                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    📄
                  </div>

                  <p className="text-base">
                    Manage Insurance Claims
                  </p>

                </div>


                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    📊
                  </div>

                  <p className="text-base">
                    Real-Time Claim Tracking
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* Right Side */}
          <div className="p-8 md:p-10 flex flex-col justify-center">

            {
              showRegister ? (

                /* Register Form */
                <div>

                  <div className="mb-8">

                    <h2 className="text-3xl font-bold">
                      Register
                    </h2>

                    <p className="text-gray-400 mt-3 text-base">
                      Create your account to get started.
                    </p>

                  </div>

                  <form className="space-y-6"
                  onSubmit={handleRegister}
                  >

                    {/* Full Name */}
                    <div>

                      <label className="block text-gray-300 mb-3">
                        Full Name
                      </label>

                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e)=>setFullName(e.target.value)}
                        className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500"
                      />

                    </div>


                    {/* Email */}
                    <div>

                      <label className="block text-gray-300 mb-3">
                        Email Address
                      </label>

                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500"
                      />

                    </div>


                    {/* Password */}
                    <div>

                      <label className="block text-gray-300 mb-3">
                        Password
                      </label>

                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500"
                      />

                    </div>


                    


                    {/* Button */}
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-2xl text-base font-semibold transition"
                    >
                      Register
                    </button>

                  </form>


                  {/* Switch */}
                  <p className="text-gray-400 text-center mt-8 text-sm">

                    Already have an account?

                    <button
                      onClick={() => setShowRegister(false)}
                      className="text-blue-500 hover:text-blue-400 ml-2"
                    >
                      Login
                    </button>

                  </p>

                </div>

              ) : (

                /* Login Form */
                <div>

                  <div className="mb-8">

                    <h2 className="text-3xl font-bold">
                      Login
                    </h2>

                    <p className="text-gray-400 mt-3 text-base">
                      Enter your credentials to continue.
                    </p>

                  </div>

                  <form className="space-y-6"
                  onSubmit={handleLogin}>

                    {/* Email */}
                    <div>

                      <label className="block text-gray-300 mb-3">
                        Email Address
                      </label>

                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500"
                      />

                    </div>


                    {/* Password */}
                    <div>

                      <label className="block text-gray-300 mb-3">
                        Password
                      </label>

                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-3 focus:outline-none focus:border-blue-500"
                      />

                    </div>


                    {/* Button */}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl text-base font-semibold transition"
                    >
                      Login
                    </button>

                  </form>


                  {/* Switch */}
                  <p className="text-gray-400 text-center mt-8 text-sm">

                    Don’t have an account?

                    <button
                      onClick={() => setShowRegister(true)}
                      className="text-blue-500 hover:text-blue-400 ml-2"
                    >
                      Register
                    </button>

                  </p>

                </div>

              )
            }

          </div>

        </div>

      </section>

    </div>
  )
}

export default Auth