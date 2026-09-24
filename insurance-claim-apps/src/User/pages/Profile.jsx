import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">

        {/* Top Section */}
        <div className="h-32 bg-gradient-to-br from-gray-900 to-black"></div>

        {/* Profile Image */}
        <div className="flex justify-center -mt-16">
          <div className="p-1 rounded-full bg-blue-600">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Profile"
              className="w-28 h-28 rounded-full bg-gray-900 border-4 border-gray-950 object-cover"
            />
          </div>
        </div>

        {/* Name */}
        <div className="text-center mt-4 px-6">

          <h1 className="text-2xl font-bold">
            {user?.fullname || "User"}
          </h1>

          <p className="text-blue-500 text-sm font-medium mt-1">
            Premium Member
          </p>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mx-8 mt-6"></div>

        {/* Details */}
        <div className="px-8 py-7 space-y-6">

          {/* Email */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-500/10">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Email Address
              </p>

              <p className="text-sm text-gray-200 mt-1">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-500/10">
              <Phone className="w-5 h-5 text-blue-500" />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Phone Number
              </p>

              <p className="text-sm text-gray-200 mt-1">
                {user?.phone || "Not provided"}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-500/10">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Location
              </p>

              <p className="text-sm text-gray-200 mt-1">
                {user?.location || "Not provided"}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;