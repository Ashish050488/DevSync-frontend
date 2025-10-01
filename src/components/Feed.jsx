// src/components/Feed.jsx

import axios from "axios";
import { baseURL } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
// 👇 1. IMPORT `removeUserFromFeed`
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { FaTimes, FaCheck } from "react-icons/fa";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  // This is no longer needed if you use Redux to remove users
  // const [index, setIndex] = useState(0);

  const getFeed = async () => {
    // This logic is simplified as we will now remove users from the feed array
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

  if (!feed || feed.length === 0) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <h1 className="text-xl font-semibold">No more users found! 🎉</h1>
      </div>
    );
  }

  // 👇 2. THIS IS THE FULLY CORRECTED FUNCTION
  const handleChoice = async (choice) => {
    const currentUser = feed[0]; // Always act on the first user in the array
    if (!currentUser) return;

    // Map your choice to the status your API expects
    const status = choice === "accept" ? "interested" : "ignored";

    try {
      // Make the API call
      await axios.post(
        `${baseURL}/request/send/${status}/${currentUser._id}`,
        {},
        { withCredentials: true }
      );
      // On success, remove the user from the feed
      dispatch(removeUserFromFeed(currentUser._id));
    } catch (err) {
      console.error("Failed to send user choice:", err);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center">
      <div className="relative w-[90vw] max-w-lg h-[75vh]">
        {/* 👇 3. ALWAYS RENDER THE FIRST USER FROM THE FEED */}
        <UserCard user={feed[0]} />

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