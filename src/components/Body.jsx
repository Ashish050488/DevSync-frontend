"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"
import axios from "axios"
import { baseURL } from "../api/api"
import { addUser } from "../utils/userSlice"
import NavBar from "./NavBar"

const Body = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userData = useSelector((store) => store.user)

  const fetchUser = async () => {
    if (userData) return
    try {
      const res = await axios.get(baseURL + "/profile/view", {
        withCredentials: true,
      })
      dispatch(addUser(res.data))
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login")
      }
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white text-black">
      {/* Navbar fixed height */}
      <header className="h-16 border-b border-black/10">
        <NavBar />
      </header>

      {/* Main now scrolls and does NOT center children */}
      <main className="flex-1 overflow-auto bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Body
