import React, { useEffect } from 'react'
import { baseURL } from "../api/api"
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux'
import { addRequests } from "../utils/requestSlice"
import { FaCheck, FaTimes } from "react-icons/fa"

const Requests = () => {
  const requests = useSelector((store) => store.request)
  const dispatch = useDispatch();

  const fetchRequest = async () => {
    try {
      const res = await axios.get(baseURL + "/user/requests/received", {
        withCredentials: true
      });

      dispatch(addRequests(res.data.data))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchRequest();
  }, [])

  if (!requests) return <h1 className="text-center mt-10 text-lg">Loading...</h1>;
  if (requests.length === 0) return <h1 className="text-center mt-10 text-lg">No Requests found</h1>;

  return (
    <div className="max-w-3xl mx-auto my-10 px-4 ">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Requests
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        {requests.map((req) => {
          const { firstName, photoUrl, lastName, about, age, gender } = req.fromUserId;
          return (
            <div
              key={req._id}
              className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition"
            >
              {/* Left Profile Info */}
              <div className="flex items-center gap-4">
                <img
                  alt={`${firstName} ${lastName}`}
                  className="w-16 h-16 rounded-full object-cover border"
                  src={photoUrl}
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {gender} • {age ? `${age} years old` : "Age not available"}
                  </p>
                  <p className="text-sm text-gray-600">{about || "No bio available"}</p>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex gap-3">
                <button className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition">
                  <FaCheck size={18} />
                </button>
                <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition">
                  <FaTimes size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Requests
