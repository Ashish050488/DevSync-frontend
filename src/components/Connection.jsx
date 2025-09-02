"use client"

import { useEffect } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { FiUsers, FiUser, FiCalendar } from "react-icons/fi"
import { addConnections } from "../utils/connectionSlice"
import { baseURL } from "../api/api"

const Connection = () => {
  const connections = useSelector((store) => store.connection)
  const dispatch = useDispatch()

  const fetchConnection = async () => {
    try {
      const res = await axios.get(baseURL + "/user/connections", {
        withCredentials: true,
      })
      dispatch(addConnections(res.data.data))
    } catch (err) {
      console.log("Error in fetching connection : ", err)
    }
  }

  useEffect(() => {
    fetchConnection()
  }, [])

  if (!connections)
    return (
      <div className="max-w-3xl mx-auto px-4 my-10">
        <h1 className="text-center text-base text-black">Loading...</h1>
      </div>
    )

  if (connections.length === 0)
    return (
      <div className="max-w-3xl mx-auto px-4 my-10">
        <div className="flex flex-col items-center gap-2 text-black">
          <FiUsers className="h-5 w-5" aria-hidden="true" />
          <h1 className="text-base">No connection found</h1>
        </div>
      </div>
    )

  return (
    <main className="max-w-3xl mx-auto my-10 px-4">
      <header className="flex items-center justify-center gap-2 mb-6">
        <FiUsers className="h-5 w-5 text-black" aria-hidden="true" />
        <h1 className="text-2xl font-semibold text-black">Connections</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2" role="list">
        {connections.map((connection) => {
          const { firstName, photoUrl, lastName, about, age, gender } = connection
          const fullName = [firstName, lastName].filter(Boolean).join(" ")

          return (
            <article
              key={connection._id}
              role="listitem"
              className="flex items-center gap-4 p-4 bg-white border border-black/10 rounded-xl"
            >
              {photoUrl ? (
                <img
                  alt={fullName || "User"}
                  className="w-14 h-14 rounded-full object-cover border border-black/10"
                  src={photoUrl || "/placeholder.svg"}
                />
              ) : (
                <div
                  aria-label={fullName || "User"}
                  className="w-14 h-14 rounded-full border border-black/10 bg-white grid place-items-center"
                >
                  <FiUser className="h-6 w-6 text-black" aria-hidden="true" />
                </div>
              )}

              <div className="min-w-0">
                <h2 className="text-base font-medium text-black truncate">{fullName || "Unknown"}</h2>

                <div className="flex items-center gap-3 text-sm text-black/70">
                  <span className="inline-flex items-center gap-1">
                    <FiUser className="h-4 w-4" aria-hidden="true" />
                    <span>{gender || "—"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiCalendar className="h-4 w-4" aria-hidden="true" />
                    <span>{age ? `${age}` : "—"}</span>
                  </span>
                </div>

                <p className="text-sm text-black/80 truncate">{about || "No bio available"}</p>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default Connection
