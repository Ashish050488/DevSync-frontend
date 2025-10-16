import { useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addUser } from "../utils/userSlice" // ✅ Adjust path as needed
import { baseURL } from "../api/api"

export default function Login({ onSwitchToSignup }) {
  const [formData, setFormData] = useState({
    emailId: "", // ✅ match key expected by backend
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
      const res = await axios.post(baseURL + "/login",
        {
          emailId: formData.emailId,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      )
      dispatch(addUser(res.data.user))
      navigate("/")
    } catch (err) {
      const msg = err.response?.data || "Login failed. Try again."
      setError(msg)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 md:p-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">Login to DevSync</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full px-4 py-4 border-2 border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-black bg-white"
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
            className="w-full px-4 py-4 border-2 border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-black bg-white"
            placeholder="Enter your password"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500 font-medium text-center -mt-4">{error}</p>
        )}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200 text-base"
        >
          Login
        </button>
      </form>

      {/* Switch to Signup */}
      <div className="text-center mt-8">
        <p className="text-sm text-black">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToSignup}
            className="font-medium text-black underline hover:no-underline transition-all duration-200"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
} 