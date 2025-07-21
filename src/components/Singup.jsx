import { useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addUser } from "../utils/userSlice" // ✅ Adjust the path as needed
import { Link } from "react-router-dom"

export default function Signup({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  })
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        "http://localhost:7777/signup",
        formData,
        {
          withCredentials: true,
        }
      )
      dispatch(addUser(res.data.user))
      navigate("/login")
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Try again."
      setError(msg)
    }
  }

  return (
  <div className="w-full h-fit flex justify-center items-center bg-white">
      <div className="w-full  mx-auto bg-white p-8 ">
      <div className="text-center ">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">Create your DevSync account</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 border-2 border-black rounded-lg text-black placeholder-gray-500 bg-white"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-black mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 border-2 border-black rounded-lg text-black placeholder-gray-500 bg-white"
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="emailId" className="block text-sm font-medium text-black mb-2">
            Email
          </label>
          <input
            type="email"
            id="emailId"
            name="emailId"
            value={formData.emailId}
            onChange={handleChange}
            required
            className="w-full px-4 py-4 border-2 border-black rounded-lg text-black placeholder-gray-500 bg-white"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-4 border-2 border-black rounded-lg text-black placeholder-gray-500 bg-white"
            placeholder="Create a password"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500 font-medium text-center -mt-4">{error}</p>
        )}

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200 text-base"
        >
          Create Account
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center mt-8">
        <p className="text-sm text-black">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="font-medium text-black underline hover:no-underline transition-all duration-200"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  </div>
  )
}
