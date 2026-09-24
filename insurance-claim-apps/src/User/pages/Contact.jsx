import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Contact() {
  return (
    <div>
       
    <div className="bg-black text-white min-h-screen">

      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">

        <div className="text-center">

          <h1 className="text-5xl md:text-6xl font-bold">
            Contact <span className="text-blue-500">Us</span>
          </h1>

          <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto leading-8">
            Have questions about insurance claims or policies?
            Our support team is here to help you anytime.
          </p>

        </div>

      </section>


      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Left Side */}
          <div className="bg-gray-950 border border-gray-800 rounded-3xl p-10">

            <h2 className="text-3xl font-bold mb-10">
              Get In Touch
            </h2>

            {/* Contact Info */}
            <div className="space-y-8">

              <div className="flex items-start gap-5">

                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-2xl">
                  📍
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    Office Address
                  </h3>

                  <p className="text-gray-400 mt-2 leading-7">
                    SecureClaim Insurance Pvt Ltd <br />
                    MG Road, Kochi, Kerala, India
                  </p>
                </div>

              </div>


              <div className="flex items-start gap-5">

                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-2xl">
                  📞
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    Phone Number
                  </h3>

                  <p className="text-gray-400 mt-2">
                    +91 98765 43210
                  </p>
                </div>

              </div>


              <div className="flex items-start gap-5">

                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-2xl">
                  ✉️
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    Email Address
                  </h3>

                  <p className="text-gray-400 mt-2">
                    support@secureclaim.com
                  </p>
                </div>

              </div>

            </div>


            {/* Support Box */}
            <div className="bg-black border border-gray-800 rounded-2xl p-6 mt-12">

              <h3 className="text-2xl font-semibold">
                24/7 Customer Support
              </h3>

              <p className="text-gray-400 leading-7 mt-4">
                Our support team is available anytime to help you
                with claim submissions, policy information,
                and account assistance.
              </p>

            </div>

          </div>


{/* Right Side */}
<div className="bg-gray-950 border border-gray-800 rounded-3xl p-10">

  <h2 className="text-3xl font-bold mb-10">
    Why Contact SecureClaim?
  </h2>

  <div className="space-y-8">

    {/* Box 1 */}
    <div className="bg-black border border-gray-800 rounded-2xl p-6">

      <div className="text-4xl mb-4">
        🛡️
      </div>

      <h3 className="text-2xl font-semibold">
        Claim Assistance
      </h3>

      <p className="text-gray-400 leading-7 mt-4">
        Get professional support for submitting insurance claims,
        document verification, and approval tracking.
      </p>

    </div>


    {/* Box 2 */}
    <div className="bg-black border border-gray-800 rounded-2xl p-6">

      <div className="text-4xl mb-4">
        ⚡
      </div>

      <h3 className="text-2xl font-semibold">
        Fast Response
      </h3>

      <p className="text-gray-400 leading-7 mt-4">
        Our support team responds quickly to customer queries
        and provides real-time assistance for claim-related issues.
      </p>

    </div>


    {/* Box 3 */}
    <div className="bg-black border border-gray-800 rounded-2xl p-6">

      <div className="text-4xl mb-4">
        🔒
      </div>

      <h3 className="text-2xl font-semibold">
        Secure Communication
      </h3>

      <p className="text-gray-400 leading-7 mt-4">
        Your information and documents are securely handled
        with advanced protection and privacy standards.
      </p>

    </div>

  </div>

</div>
        </div>

      </section>

      <Footer />

    </div>

      
    </div>
  )
}

export default Contact
