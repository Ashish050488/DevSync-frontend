"use client"

import { useEffect } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { FaCheck, FaTimes } from "react-icons/fa"
import { baseURL } from "../api/api"
import { addRequests, removeRequest } from "../utils/requestSlice"

const Requests = () => {
  const requests = useSelector((store) => store.request)
  const dispatch = useDispatch()

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(`${baseURL}/request/review/${status}/${_id}`, {}, { withCredentials: true })
      dispatch(removeRequest(_id))
    } catch (err) {
      console.log(err)
    }
  }

  const fetchRequest = async () => {
    try {
      const res = await axios.get(`${baseURL}/user/requests/received`, { withCredentials: true })
      dispatch(addRequests(res.data.data))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchRequest()
  }, [])

  // Loading + Empty (left-aligned, monochrome)
  if (!requests) {
    return (
      <div className="w-full max-w-3xl px-4 py-6">
        <h2 className="text-base text-black/70">Loading...</h2>
      </div>
    )
  }
  if (requests.length === 0) {
    return (
      <div className="w-full max-w-3xl px-4 py-6">
        <h2 className="text-base text-black/70">No requests found</h2>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold text-black">Requests</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {requests.map((req) => {
          const u = req?.fromUserId || {}
          const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ") || "Unknown User"
          const details = [u.gender ? String(u.gender) : null, u.age ? `${u.age}` : null].filter(Boolean).join(" • ")

          return (
            <div
              key={req._id}
              className="flex items-start justify-between gap-4 rounded-md border border-black/10 bg-white p-4"
            >
              {/* Profile */}
              <div className="flex min-w-0 items-start gap-3">
                <img
                  src={u.photoUrl || "/placeholder.svg?height=64&width=64&query=user%20avatar"}
                  alt={fullName}
                  className="h-12 w-12 shrink-0 rounded-full border border-black/10 object-cover"
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-black">{fullName}</div>
                  {details ? (
                    <div className="truncate text-xs text-black/60">{details}</div>
                  ) : (
                    <div className="truncate text-xs text-black/60">Info unavailable</div>
                  )}
                  <div className="mt-1 line-clamp-2 text-xs text-black/70">{u.about || "No bio available"}</div>
                </div>
              </div>

              {/* Actions (monochrome, no animations) */}
              <div className="flex shrink-0 items-center gap-2">
                <button
                  aria-label="Accept request"
                  onClick={() => reviewRequest("accepted", req._id)}
                  className="group inline-flex items-center justify-center rounded-md border border-black bg-black px-3 py-1 text-xs font-medium text-white transition-transform transition-colors duration-150 ease-out hover:-translate-y-0.5 hover:bg-black/90 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 motion-reduce:transform-none"
                >
                  <FaCheck className="mr-1 h-3 w-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
                  Accept
                </button>
                <button
                  aria-label="Reject request"
                  onClick={() => reviewRequest("rejected", req._id)}
                  className="group inline-flex items-center justify-center rounded-md border border-black px-3 py-1 text-xs font-medium text-black transition-transform transition-colors duration-150 ease-out hover:-translate-y-0.5 hover:bg-black/5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 motion-reduce:transform-none"
                >
                  <FaTimes className="mr-1 h-3 w-3 transition-transform duration-150 ease-out group-hover:-translate-x-0.5 motion-reduce:transform-none" />
                  Reject
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Requests
