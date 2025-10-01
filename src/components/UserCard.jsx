import axios from "axios";
import { baseURL } from "../api/api";
import { useDispatch } from "react-redux";
import {removeUserFromFeed} from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    console.log(`API Call Triggered in UserCard for user ${userId} with status: ${status}`);
    try {
      await axios.post(
        `${baseURL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-base-300 shadow-xl rounded-lg h-full w-full flex flex-col gap-5 overflow-hidden">

      {/* Image - 35% */}
      <div className="h-90 w-full">
        <img
          src={photoUrl}
          alt="User"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info - 45% */}
      <div className="flex-[0_0_45%] px-4 py-2 flex flex-col overflow-hidden">
        <h2 className="text-xl font-semibold truncate">
          {firstName} {lastName}
        </h2>
        {age && gender && (
          <p className="text-sm text-black">{age}, {gender}</p>
        )}
        <p className="text-sm text-gray-700 mt-2 overflow-hidden line-clamp-4">
          {about}
        </p>
      </div>

      {/* Buttons - 20% */}
      <div className="flex-[0_0_20%] px-4 py-3 flex items-center justify-center gap-4">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleSendRequest("ignored", _id)}
        >
          Ignore
        </button>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => handleSendRequest("interested", _id)}
        >
          Interested
        </button>
      </div>
    </div>
  );
};

export default UserCard;
