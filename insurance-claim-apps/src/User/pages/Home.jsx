import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Home() {
    return (
        <div>
            <div className="bg-black text-white overflow-hidden">


                <Header />
                {/* Hero Section */}
                <section className="relative">

                    {/* Background Blur */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>

                    <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid lg:grid-cols-2 gap-20 items-center relative z-10">

                        {/* Left Content */}
                        <div>

                            <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-full mb-8">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>

                                <p className="text-sm text-gray-300">
                                    Trusted by thousands of policy holders
                                </p>
                            </div>


                            <h1 className="text-5xl md:text-7xl font-bold leading-tight">

                                Modern &
                                <span className="text-blue-500"> Secure</span>

                                <br />

                                Insurance Claim
                                Platform

                            </h1>


                            <p className="text-gray-400 text-lg leading-8 mt-8 max-w-2xl">
                                Experience a faster and smarter way to manage insurance claims.
                                Upload documents securely, track approvals in real-time,
                                and simplify the entire claim process digitally.
                            </p>


                            {/* Buttons */}
                            <div className="flex flex-wrap gap-5 mt-10">

                                <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl text-lg font-semibold transition shadow-lg shadow-blue-600/30">
                                    Submit Claim
                                </button>

                                <button className="border border-gray-700 hover:border-blue-500 hover:text-blue-500 px-8 py-4 rounded-2xl text-lg transition">
                                    Explore Policies
                                </button>

                            </div>


                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 mt-16">

                                <div>
                                    <h2 className="text-4xl font-bold text-white">
                                        10K+
                                    </h2>

                                    <p className="text-gray-400 mt-2">
                                        Claims Processed
                                    </p>
                                </div>


                                <div>
                                    <h2 className="text-4xl font-bold text-white">
                                        98%
                                    </h2>

                                    <p className="text-gray-400 mt-2">
                                        Approval Rate
                                    </p>
                                </div>


                                <div>
                                    <h2 className="text-4xl font-bold text-white">
                                        24/7
                                    </h2>

                                    <p className="text-gray-400 mt-2">
                                        Support
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* Right Side */}
                        <div className="relative flex justify-center">

                            {/* Glow */}
                            <div className="absolute w-[450px] h-[450px] bg-blue-600/20 blur-3xl rounded-full"></div>

                            {/* Main Card */}
                            <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 shadow-2xl w-full max-w-xl">

                                <img
                                    src="https://img.freepik.com/free-vector/insurance-concept-illustration_114360-1630.jpg"
                                    alt="Insurance"
                                    className="rounded-2xl"
                                />

                                {/* Floating Status Card */}

                            </div>
                        </div>

                    </div>

                </section>


                {/* Features Section */}
                <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">

                    <div className="text-center">

                        <h2 className="text-5xl font-bold">
                            Powerful Features
                        </h2>

                        <p className="text-gray-400 text-lg mt-5 max-w-2xl mx-auto">
                            Designed to simplify insurance claim management with modern technology.
                        </p>

                    </div>


                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

                        {/* Card 1 */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-blue-500 hover:-translate-y-2 transition duration-300">

                            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600/20 text-4xl">
                                📄
                            </div>

                            <h3 className="text-2xl font-semibold mt-8">
                                Easy Claim Submission
                            </h3>

                            <p className="text-gray-400 leading-7 mt-4">
                                Submit insurance claims quickly with a smooth and user-friendly digital workflow.
                            </p>

                        </div>


                        {/* Card 2 */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-blue-500 hover:-translate-y-2 transition duration-300">

                            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600/20 text-4xl">
                                🔒
                            </div>

                            <h3 className="text-2xl font-semibold mt-8">
                                Secure Document Upload
                            </h3>

                            <p className="text-gray-400 leading-7 mt-4">
                                Upload policy documents, bills, and reports with advanced data security.
                            </p>

                        </div>


                        {/* Card 3 */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-blue-500 hover:-translate-y-2 transition duration-300">

                            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600/20 text-4xl">
                                📊
                            </div>

                            <h3 className="text-2xl font-semibold mt-8">
                                Real-Time Tracking
                            </h3>

                            <p className="text-gray-400 leading-7 mt-4">
                                Monitor claim status instantly from submission to final approval.
                            </p>

                        </div>

                    </div>

                </section>


                {/* Process Section */}
                <section className="bg-gray-950 border-y border-gray-900 py-24">

                    <div className="max-w-7xl mx-auto px-6 md:px-12">

                        <div className="text-center">

                            <h2 className="text-5xl font-bold">
                                How It Works
                            </h2>

                            <p className="text-gray-400 text-lg mt-5">
                                Simple process for managing insurance claims.
                            </p>

                        </div>


                        <div className="grid md:grid-cols-3 gap-10 mt-20">

                            <div className="text-center">

                                <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
                                    1
                                </div>

                                <h3 className="text-2xl font-semibold mt-8">
                                    Register Account
                                </h3>

                                <p className="text-gray-400 leading-7 mt-4">
                                    Create your account and access your insurance dashboard.
                                </p>

                            </div>


                            <div className="text-center">

                                <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
                                    2
                                </div>

                                <h3 className="text-2xl font-semibold mt-8">
                                    Submit Claim
                                </h3>

                                <p className="text-gray-400 leading-7 mt-4">
                                    Upload documents and provide incident details easily.
                                </p>

                            </div>


                            <div className="text-center">

                                <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
                                    3
                                </div>

                                <h3 className="text-2xl font-semibold mt-8">
                                    Track Approval
                                </h3>

                                <p className="text-gray-400 leading-7 mt-4">
                                    Monitor your claim progress in real-time until approval.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>


                {/* CTA */}
                <section className="py-24">

                    <div className="max-w-5xl mx-auto px-6">

                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[40px] p-14 text-center shadow-2xl">

                            <h2 className="text-5xl font-bold">
                                Ready to Get Started?
                            </h2>

                            <p className="text-blue-100 text-lg mt-6 max-w-2xl mx-auto leading-8">
                                Join thousands of users managing their insurance claims digitally with speed and security.
                            </p>

                            <button className="mt-10 bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-2xl text-lg font-semibold transition">
                                Create Free Account
                            </button>

                        </div>

                    </div>

                </section>

                <Footer />
            </div>

        </div>
    )
}

export default Home
