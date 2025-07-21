"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { baseURL } from "../api/api"
import { addUser } from "../utils/userSlice"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Animation state for fade-in
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  // core form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    emailId: "",
    about: "",
    photoUrl: "",
    skills: [],
  })

  // raw text for the skills input
  const [skillsInput, setSkillsInput] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100)

    if (user) {
      const initial = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        emailId: user.emailId || "",
        about: user.about || "",
        photoUrl: user.photoUrl || "",
        skills: user.skills || [],
      }
      setFormData(initial)
      setSkillsInput((user.skills || []).join(", "))
    }

    return () => clearTimeout(timer)
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "skills") {
      setSkillsInput(value)
    } else if (name === "age") {
      const num = Number.parseInt(value)
      setFormData((prev) => ({
        ...prev,
        age: isNaN(num) ? undefined : num,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s)
    const payload = { ...formData, skills: skillsArray }

    try {
      const res = await axios.patch(`${baseURL}/profile/edit`, payload, {
        withCredentials: true,
      })
      dispatch(addUser(res.data.user))
      navigate("/profile")
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed. Try again."
      setError(msg)
    }
  }

  const tabs = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "contact", label: "Contact", icon: "📧" },
    { id: "professional", label: "Professional", icon: "💼" },
  ]

  return (
    <div
      className={`h-screen bg-white flex transition-opacity duration-400 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Left Sidebar - Profile Preview */}
      <div className="w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        {/* Profile Header */}
        <div className="p-6 text-center border-b border-gray-700">
          <div className="relative inline-block mb-4">
            {formData.photoUrl ? (
              <img
                src={formData.photoUrl || "/placeholder.svg?height=80&width=80"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-600 border-3 border-white shadow-lg flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h2 className="text-xl font-bold">
            {formData.firstName || formData.lastName
              ? `${formData.firstName} ${formData.lastName}`.trim()
              : "Your Name"}
          </h2>
          <p className="text-gray-300 text-sm mt-1">{formData.emailId || "your.email@example.com"}</p>
        </div>

        {/* Profile Stats */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{formData.age || "—"}</div>
                <div className="text-xs text-gray-400">Age</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{formData.skills.length}</div>
                <div className="text-xs text-gray-400">Skills</div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Gender</div>
                <div className="text-sm capitalize">{formData.gender || "Not specified"}</div>
              </div>

              {formData.skills.length > 0 && (
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.slice(0, 6).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {formData.skills.length > 6 && (
                      <span className="px-2 py-1 bg-gray-600 rounded text-xs">+{formData.skills.length - 6}</span>
                    )}
                  </div>
                </div>
              )}

              {formData.about && (
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">About</div>
                  <div className="text-sm leading-relaxed text-gray-200">
                    {formData.about.length > 100 ? `${formData.about.substring(0, 100)}...` : formData.about}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-black">Profile Settings</h1>
            <button
              type="submit"
              form="profile-form"
              className="bg-black text-white px-6 py-2 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 font-medium"
            >
              Save Changes
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="profile-form" onSubmit={handleSubmit} className="max-w-2xl">
            {/* Personal Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-black mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-black mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-medium text-black mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-black mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-black mb-2">Profile Picture URL</label>
                  <input
                    type="url"
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-black mb-2">Email Address</label>
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    disabled
                    className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed for security reasons</p>
                </div>

                <div>
                  <label className="block text-base font-medium text-black mb-2">About Me</label>
                  <textarea
                    name="about"
                    rows={6}
                    value={formData.about}
                    onChange={handleChange}
                    placeholder="Tell us about yourself, your experience, and interests..."
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.about.length}/500 characters</p>
                </div>
              </div>
            )}

            {/* Professional Tab */}
            {activeTab === "professional" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-black mb-2">
                    Skills
                    <span className="text-sm text-gray-500 font-normal ml-1">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={skillsInput}
                    onChange={handleChange}
                    placeholder="e.g. JavaScript, React, Node.js, Python, Design"
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-sm text-gray-500 mt-1">Add skills that represent your expertise and interests</p>
                </div>

                {/* Skills Preview */}
                {formData.skills.length > 0 && (
                  <div>
                    <p className="text-base font-medium text-black mb-2">Skills Preview</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium text-center">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
