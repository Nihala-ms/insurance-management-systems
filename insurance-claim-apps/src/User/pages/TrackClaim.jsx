import React from 'react'

function TrackClaim() {

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-10">
        Track Claims
      </h1>

      <div className="space-y-6">

        <div className="bg-gray-950 border border-gray-800 p-6 rounded-3xl flex justify-between">

          <div>

            <h2 className="text-2xl font-semibold">
              Vehicle Insurance
            </h2>

            <p className="text-gray-400 mt-2">
              Submitted on 12 May 2026
            </p>

          </div>

          <span className="text-green-400">
            Approved
          </span>

        </div>



        <div className="bg-gray-950 border border-gray-800 p-6 rounded-3xl flex justify-between">

          <div>

            <h2 className="text-2xl font-semibold">
              Health Insurance
            </h2>

            <p className="text-gray-400 mt-2">
              Submitted on 05 May 2026
            </p>

          </div>

          <span className="text-yellow-400">
            Pending
          </span>

        </div>

      </div>

    </div>

  )
}

export default TrackClaim