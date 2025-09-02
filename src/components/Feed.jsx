import axios from "axios";
import { baseURL } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { FaTimes, FaCheck } from "react-icons/fa"; // using react-icons

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    try {
      const res = await axios.get(baseURL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length === 0 || index >= feed.length)
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <h1 className="text-xl font-semibold">No more users found! 🎉</h1>
      </div>
    );

  const handleChoice = (choice) => {
    console.log("User choice:", choice, feed[index]);
    setIndex((prev) => prev + 1);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center">
      <div className="relative w-[90vw] max-w-lg h-[75vh]">
        <UserCard user={feed[index]} />

        {/* Floating Tinder buttons */}
        <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-12">
          <button
            onClick={() => handleChoice("reject")}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-500 shadow-lg hover:scale-110 transition"
          >
            <FaTimes size={28} />
          </button>
          <button
            onClick={() => handleChoice("accept")}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-500 shadow-lg hover:scale-110 transition"
          >
            <FaCheck size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
