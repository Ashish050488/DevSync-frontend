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

  const [currentStep, setCurrentStep] = useState(0)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [isSaving, setIsSaving] = useState(false)

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

  useEffect(() => {
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
  }, [user])

  // Toast notification system
  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" })
    }, 3000)
  }

  // Save functionality
  const saveProfile = async () => {
    if (isSaving) return

    setIsSaving(true)

    try {
      // Prepare payload
      const skillsArray = formData.skills || []
      const payload = {
        ...formData,
        skills: skillsArray,
        age: formData.age || undefined,
      }

      const response = await axios.patch(`${baseURL}/profile/edit`, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Update Redux store
      dispatch(addUser(response.data.user || response.data))

      // Show success toast
      showToast("Profile saved successfully! ✓", "success")
    } catch (error) {
      console.error("Save error:", error)

      let errorMessage = "Failed to save profile"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.request) {
        errorMessage = "Network error - please try again"
      }

      showToast(errorMessage, "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "skills") {
      setSkillsInput(value)
      const skillsArray = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)
      setFormData((prev) => ({ ...prev, skills: skillsArray }))
    } else if (name === "age") {
      const num = Number.parseInt(value)
      setFormData((prev) => ({
        ...prev,
        age: isNaN(num) ? "" : num,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle Enter key press to save
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveProfile()
    }
  }

  // Final save and navigate
  const handleFinalSave = async () => {
    if (!formData.firstName.trim()) {
      showToast("First name is required", "error")
      return
    }

    await saveProfile()
    showToast("Profile completed successfully! 🎉", "success")

    setTimeout(() => {
      navigate("/profile")
    }, 2000)
  }

  const steps = [
    {
      id: "basic",
      title: "Basic Info",
      icon: "👤",
    },
    {
      id: "contact",
      title: "Contact",
      icon: "📧",
    },
    {
      id: "professional",
      title: "Skills",
      icon: "💼",
    },
  ]

  // Calculate profile completion percentage
  const getCompletionPercentage = () => {
    const fields = [
      formData.firstName,
      formData.lastName,
      formData.age,
      formData.gender,
      formData.emailId,
      formData.about,
      formData.photoUrl,
      formData.skills.length > 0,
    ]
    const completed = fields.filter(Boolean).length
    return Math.round((completed / fields.length) * 100)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-16 pb-2 overflow-hidden">
      {/* Toast Notification System */}
      {toast.show && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border-l-4 ${
            toast.type === "success"
              ? "bg-white border-green-500 text-green-800"
              : "bg-white border-red-500 text-red-800"
          }`}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                toast.type === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {toast.type === "success" ? "✓" : "✗"}
            </div>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl h-full">
        <div className="h-full grid grid-cols-12 gap-4">
          {/* Left Panel - Form */}
          <div className="col-span-8 h-full">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 h-full flex flex-col">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-3 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-black text-lg">✨</span>
                    </div>
                    <div>
                      <h1 className="text-lg font-bold">Profile Studio</h1>
                      <p className="text-xs text-gray-300">{steps[currentStep].title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{getCompletionPercentage()}%</div>
                    <div className="text-xs text-gray-300">Complete</div>
                  </div>
                </div>

                {/* Save Status */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {isSaving ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-gray-300">Saving...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-xs text-gray-300">Press Enter to save</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="flex space-x-1 mt-3">
                  {steps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(index)}
                      className={`flex-1 p-2 rounded-lg transition-colors duration-200 ${
                        currentStep === index
                          ? "bg-white text-black"
                          : index < currentStep
                            ? "bg-white/20 text-white border border-white/30"
                            : "bg-white/10 text-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-sm">{step.icon}</span>
                        <span className="text-xs font-medium">{step.title}</span>
                        {index < currentStep && <span className="text-xs">✓</span>}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div
                      className="bg-white h-1 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 p-4 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1">
                    {/* Step 0: Basic Info */}
                    {currentStep === 0 && (
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-black">
                            <label className="block text-sm font-bold text-black mb-1">First Name *</label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              onKeyPress={handleKeyPress}
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="Enter first name"
                            />
                            <p className="text-xs text-gray-500 mt-1">Press Enter to save</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-gray-400">
                            <label className="block text-sm font-bold text-black mb-1">Age</label>
                            <input
                              type="number"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              onKeyPress={handleKeyPress}
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              min="1"
                              max="120"
                              placeholder="Your age"
                            />
                            <p className="text-xs text-gray-500 mt-1">Press Enter to save</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-black">
                            <label className="block text-sm font-bold text-black mb-1">Last Name</label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              onKeyPress={handleKeyPress}
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="Enter last name"
                            />
                            <p className="text-xs text-gray-500 mt-1">Press Enter to save</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-gray-400">
                            <label className="block text-sm font-bold text-black mb-1">Gender</label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              onKeyPress={handleKeyPress}
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Press Enter to save</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 1: Contact & About */}
                    {currentStep === 1 && (
                      <div className="space-y-4 h-full">
                        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-gray-400">
                          <label className="block text-sm font-bold text-black mb-1">Email Address</label>
                          <input
                            type="email"
                            name="emailId"
                            value={formData.emailId}
                            disabled
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 mt-1">🔒 Cannot be changed for security</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-black flex-1">
                          <label className="block text-sm font-bold text-black mb-1">About Me</label>
                          <textarea
                            name="about"
                            rows={4}
                            value={formData.about}
                            onChange={handleChange}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                saveProfile()
                              }
                            }}
                            placeholder="Tell us about yourself, your experience, and interests..."
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                            maxLength={500}
                          />
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-500">Press Enter to save (Shift+Enter for new line)</p>
                            <span className="text-xs text-gray-400">{formData.about.length}/500</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Skills & Photo */}
                    {currentStep === 2 && (
                      <div className="space-y-4 h-full">
                        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-black">
                          <label className="block text-sm font-bold text-black mb-1">Skills & Expertise</label>
                          <input
                            type="text"
                            name="skills"
                            value={skillsInput}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g. JavaScript, React, UI/UX Design, Project Management"
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Separate skills with commas - Press Enter to save
                          </p>
                          {formData.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {formData.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-black text-white rounded-full text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-gray-400">
                          <label className="block text-sm font-bold text-black mb-1">Profile Picture URL</label>
                          <input
                            type="url"
                            name="photoUrl"
                            value={formData.photoUrl}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            placeholder="https://example.com/your-photo.jpg"
                            className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">💡 Press Enter to save</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:bg-gray-50 transition-colors"
                    >
                      <span>←</span>
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={saveProfile}
                        disabled={isSaving}
                        className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <span>Save Now</span>
                            <span>💾</span>
                          </>
                        )}
                      </button>

                      {currentStep < steps.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                          className="flex items-center space-x-1 px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                        >
                          <span>Next</span>
                          <span>→</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFinalSave}
                          disabled={isSaving}
                          className="flex items-center space-x-1 px-6 py-2 bg-black text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                        >
                          <span>Complete Profile</span>
                          <span>🎉</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="col-span-4 h-full">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 h-full flex flex-col">
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-gray-800 to-black p-3 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">Live Preview</h3>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${isSaving ? "bg-yellow-400 animate-pulse" : "bg-blue-400"}`}
                    ></div>
                    <span className="text-xs">{isSaving ? "Saving" : "Ready"}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Profile Completion</span>
                    <span className="font-bold">{getCompletionPercentage()}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-white to-gray-200 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${getCompletionPercentage()}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 p-3 space-y-3 overflow-hidden">
                {/* Profile Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-center">
                    <div className="inline-block relative mb-3">
                      {formData.photoUrl ? (
                        <img
                          src={formData.photoUrl || "/placeholder.svg"}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            e.target.style.display = "none"
                            e.target.nextSibling.style.display = "flex"
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center border-2 border-white shadow-md ${formData.photoUrl ? "hidden" : "flex"}`}
                      >
                        <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-black mb-1">
                      {formData.firstName || formData.lastName
                        ? `${formData.firstName} ${formData.lastName}`.trim()
                        : "Your Name"}
                    </h4>
                    <p className="text-gray-600 text-xs">{formData.emailId || "your.email@example.com"}</p>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="space-y-2 flex-1 overflow-hidden">
                  {/* Basic Info */}
                  {(formData.age || formData.gender) && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border-l-4 border-black">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-gray-800 text-xs">Personal Details</h5>
                        <span className="text-lg">👤</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white rounded p-2 text-center">
                          <div className="font-bold text-black">{formData.age || "—"}</div>
                          <div className="text-gray-600 text-xs">Age</div>
                        </div>
                        <div className="bg-white rounded p-2 text-center">
                          <div className="font-bold text-black capitalize">{formData.gender || "—"}</div>
                          <div className="text-gray-600 text-xs">Gender</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* About */}
                  {formData.about && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border-l-4 border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-gray-800 text-xs">About Me</h5>
                        <span className="text-lg">📝</span>
                      </div>
                      <div className="bg-white rounded p-2">
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {formData.about.length > 80 ? `${formData.about.substring(0, 80)}...` : formData.about}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {formData.skills.length > 0 && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border-l-4 border-black">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-bold text-gray-800 text-xs">Skills & Expertise</h5>
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">💼</span>
                          <span className="bg-black text-white px-1 py-0.5 rounded-full text-xs font-bold">
                            {formData.skills.length}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded p-2">
                        <div className="flex flex-wrap gap-1">
                          {formData.skills.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-gradient-to-r from-gray-800 to-black text-white rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {formData.skills.length > 4 && (
                            <span className="px-2 py-0.5 bg-gray-300 text-gray-700 rounded-full text-xs">
                              +{formData.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!formData.firstName &&
                    !formData.lastName &&
                    !formData.age &&
                    !formData.gender &&
                    !formData.about &&
                    formData.skills.length === 0 && (
                      <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-3xl mb-2">✨</div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">Start Building Your Profile</h4>
                        <p className="text-xs text-gray-600">Press Enter on any field to save</p>
                      </div>
                    )}
                </div>

                {/* Stats Footer */}
                {(formData.firstName || formData.lastName || formData.age || formData.skills.length > 0) && (
                  <div className="bg-gradient-to-r from-gray-800 to-black rounded-lg p-3 text-white">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-sm font-bold">{formData.skills.length}</div>
                        <div className="text-xs opacity-80">Skills</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold">{getCompletionPercentage()}%</div>
                        <div className="text-xs opacity-80">Complete</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold">{formData.about ? formData.about.length : 0}</div>
                        <div className="text-xs opacity-80">Characters</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
