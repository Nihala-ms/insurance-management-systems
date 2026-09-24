import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <div>

            <header className="bg-black border-b border-gray-800 sticky top-0 z-50">

                <nav className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="text-3xl font-bold text-white">
                        Secure<span className="text-blue-500">Claim</span>
                    </Link>


                    {/* Menu */}
                    <div className="hidden md:flex items-center gap-8 text-gray-300 font-medium">

                        {/* Home */}
                        <Link
                            to="/"
                            className="hover:text-blue-500 transition"
                        >
                            Home
                        </Link>


                        {/* Policies */}
                        <Link
                            to="/Policies"
                            className="hover:text-blue-500 transition"
                        >
                            Policies
                        </Link>


                        {/* Claims */}
                        <Link
                            to="/claims"
                            className="hover:text-blue-500 transition"
                        >
                            Claims
                        </Link>


                        {/* Contact */}
                        <Link
                            to="/contact"
                            className="hover:text-blue-500 transition"
                        >
                            Contact
                        </Link>

                    </div>


                    {/* Login Button */}
                    <Link to="/Auth">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                        >
                            Login
                        </button>
                    </Link>

                </nav>

            </header>

        </div>
    );
}

export default Header;
