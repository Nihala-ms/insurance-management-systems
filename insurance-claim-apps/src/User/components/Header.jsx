import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <div>

        
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-3xl font-bold text-white">
          Secure<span className="text-blue-500">Claim</span>
        </h1>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-300 font-medium">
          <a href="/" className="hover:text-blue-500 transition">
            Home
          </a>

          <a href="/policies" className="hover:text-blue-500 transition">
            Policies
          </a>

          <a href="/claims" className="hover:text-blue-500 transition">
            Claims
          </a>

          <a href="/contact" className="hover:text-blue-500 transition">
            Contact
          </a>
        </div>

        {/* Button */}
       <Link to={'/Auth'}> <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition">
          Login
        </button></Link>

      </nav>
    </header>

      
    </div>
  )
}

export default Header
