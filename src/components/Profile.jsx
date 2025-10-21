"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { baseURL } from "../api/api"
import { addUser } from "../utils/userSlice"
import { useNavigate } from "react-router-dom"
import { FiChevronLeft, FiChevronRight, FiSave, FiUser } from "react-icons/fi"

export default function Profile() {
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [toast, setToast] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

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
  const [skillsInput, setSkillsInput] = useState("")

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, ...user }))
      setSkillsInput((user.skills || []).join(", "))
    }
  }, [user])

  const showToast = (msg, type = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2000)
  }

  const saveProfile = async () => {
    if (isSaving) return
    setIsSaving(true)
    try {
      const res = await axios.patch(`${baseURL}/profile/edit`, formData, {
        withCredentials: true,
      })
      dispatch(addUser(res.data.user || res.data))
      showToast("Saved ✓")
    } catch {
      showToast("Save failed ✗", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e) => {
  const { name, value } = e.target
  if (name === "skills") {
    setSkillsInput(value)
    setFormData((p) => ({
      ...p,
      skills: value.split(",").map((s) => s.trim()).filter(Boolean),
    }))
  } else if (name === "age") {
    setFormData((p) => ({ ...p, [name]: Number(value) }))
  } else {
    setFormData((p) => ({ ...p, [name]: value }))
  }
}


  const steps = ["Basic", "Contact", "Skills"]

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 px-4 py-2 rounded-md shadow text-sm bg-black text-white`}>{toast.msg}</div>
      )}

      {/* Fixed-width centered card — keeps width stable across steps */}
      <div className="w-full max-w-4xl mx-auto h-[85vh]">
        <div className="h-full bg-white rounded-xl border border-black/10 flex overflow-hidden">
          {/* Left: form (2/3) */}
          <div className="w-2/3 min-w-0 flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 border-b border-black/10">
              <h1 className="text-lg font-semibold flex items-center gap-2">
                <FiUser aria-hidden className="text-black" />
                Edit Profile
              </h1>

              <div className="flex items-center gap-4">
                {steps.map((label, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i <= step ? "bg-black text-white" : "bg-black/10 text-black/60"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="text-xs text-black/60 mt-1 hidden md:block">{label}</div>
                  </div>
                ))}
              </div>
            </header>

            {/* Form body: fixed area with scroll; scrollbarGutter stabilizes layout */}
            <div className="flex-1 px-6 py-5 overflow-y-scroll" style={{ scrollbarGutter: "stable" }}>
              {step === 0 && (
                <div className="space-y-4">
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full border border-black/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full border border-black/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Age"
                      className="w-full border border-black/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border border-black/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    disabled
                    className="w-full border border-black/20 rounded px-3 py-2 bg-black/5"
                  />
                  <textarea
                    name="about"
                    rows={6}
                    value={formData.about}
                    onChange={handleChange}
                    placeholder="Short bio..."
                    className="w-full border border-black/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <input
                    name="skills"
                    value={skillsInput}
                    onChange={handleChange}
                    placeholder="Skills (comma separated)"
                    className="w-full border border-black/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    name="photoUrl"
                    value={formData.photoUrl}
                    onChange={handleChange}
                    placeholder="Photo URL"
                    className="w-full border border-black/20 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              )}
            </div>

            {/* Footer pinned, doesn't move */}
            <footer className="px-6 py-4 border-t border-black/10 flex items-center justify-between">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="px-4 py-2 border border-black rounded disabled:opacity-50 flex items-center gap-2"
              >
                <FiChevronLeft aria-hidden />
                Back
              </button>

              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                  className="px-4 py-2 bg-black text-white rounded flex items-center gap-2"
                >
                  Next
                  <FiChevronRight aria-hidden />
                </button>
              ) : (
                <button
                  onClick={saveProfile}
                  disabled={isSaving}
                  className="px-4 py-2 bg-black text-white rounded disabled:opacity-50 flex items-center gap-2"
                >
                  <FiSave aria-hidden />
                  {isSaving ? "Saving..." : "Save"}
                </button>
              )}
            </footer>
          </div>

          {/* Right: preview (1/3). Hidden on very small screens to preserve width */}
          <aside className="w-1/3 hidden md:flex flex-col items-center justify-start p-6 border-l border-black/10">
            <div className="w-28 h-28 rounded-full overflow-hidden border border-black/20 mb-4">
              <img
                src={formData.photoUrl || "/placeholder.svg?height=112&width=112&query=profile preview"}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold">
              {formData.firstName || "Your"} {formData.lastName || "Name"}
            </h3>
            <p className="text-sm text-black/60 mt-2 text-center">
              {formData.about || "Write something about yourself"}
            </p>

            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {formData.skills.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-black text-white rounded-full text-xs">
                  {s}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
