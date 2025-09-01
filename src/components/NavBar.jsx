"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { baseURL } from "../api/api"
import { removeUser } from "../utils/userSlice"

export default function Navbar() {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)
  const closeDropdown = () => setIsDropdownOpen(false)

  const handleLogout = async () => {
    try {
      await axios.post(`${baseURL}/logout`, {}, { withCredentials: true })
      dispatch(removeUser())
      navigate("/login")
    } catch (error) {
    }
  }

  return (
    <nav className="w-full bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto  lg:px-12">
        <div className="flex items-center justify-between h-18">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <div className="border-4 border-black bg-black px-6 py-3">
              <span className="text-white text-xl font-black tracking-widest font-mono">DEVSYNC</span>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-10">
                {/* Welcome Text - Hidden on mobile */}
                <div className="hidden md:flex flex-col items-end gap-1">
                  <span className="text-xs font-bold tracking-wider text-black font-mono">HELLO</span>
                  <span className="text-lg font-black tracking-wide text-black font-mono">
                    {user.firstName?.toUpperCase()}
                  </span>
                </div>

                {/* Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-3 p-2 border-2 border-transparent hover:border-black transition-all duration-200"
                  >
                    <div className="w-12 h-12 border-4 border-black bg-white flex items-center justify-center">
                      <span className="text-xl font-black text-black font-mono">
                        {user.firstName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-black transform hover:translate-y-1 transition-transform duration-200">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 8L2 4h8L6 8z" />
                      </svg>
                    </div>
                  </button>

                  {/* Dropdown Overlay */}
                  {isDropdownOpen && <div className="fixed inset-0 z-10" onClick={closeDropdown}></div>}

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border-4 border-black z-20">
                      <div
                        onClick={() => {
                          navigate("/profile")
                          closeDropdown()
                        }}
                        className="flex items-center justify-between px-5 py-4 border-b border-black hover:bg-black hover:text-white cursor-pointer transition-colors duration-100"
                      >
                        <span className="text-xs font-bold tracking-wider font-mono">PROFILE</span>
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>

                      <div 
                      onClick={()=>{
                        navigate('/connection')
                        closeDropdown()
                      }}
                      className="px-5 py-4 border-b-4 border-black hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">
                          <span className="text-xs font-bold tracking-wider font-mono">CONNECTION</span>
                      </div>
                      <div 
                      onClick={()=>{
                        navigate('/requests')
                        closeDropdown()
                      }}
                      className="px-5 py-4 border-b-4 border-black hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">
                          <span className="text-xs font-bold tracking-wider font-mono">REQUESTS</span>
                      </div>

                      <div
                        onClick={handleLogout}
                        className="px-5 py-4 bg-black text-white hover:bg-white hover:text-black cursor-pointer transition-colors duration-100"
                      >
                        <span className="text-xs font-bold tracking-wider font-mono">LOGOUT</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="border-4 border-black bg-white text-black px-8 py-4 hover:bg-black hover:text-white transition-colors duration-200"
              >
                <span className="text-xs font-bold tracking-wider font-mono">SIGN IN</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
