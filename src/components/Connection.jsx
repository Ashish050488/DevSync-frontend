import React, { useEffect } from 'react';
import { baseURL } from '../api/api';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/connectionSlice';

const Connection = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnection = async () => {
    try {
      const res = await axios.get(baseURL + '/user/connections', {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log('Error in fetching connection : ', err);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  if (!connections) return <h1 className="text-center mt-10 text-lg">Loading...</h1>;
  if (connections.length === 0) return <h1 className="text-center mt-10 text-lg">No connection found</h1>;

  return (
    <div className="max-w-3xl mx-auto my-10 px-4 ">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Connections
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        {connections.map((connection) => {
          const { firstName, photoUrl, lastName, about, age, gender } = connection;
          return (
            <div
              key={connection._id}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition"
            >
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
          );
        })}
      </div>
    </div>
  );
};

export default Connection;
