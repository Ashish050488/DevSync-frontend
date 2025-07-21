import axios from "axios";
import { baseURL } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

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

  if (feed.length === 0)
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <h1>No new users found!</h1>
      </div>
    );

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="p-10 h-full w-full max-w-md px-4">
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;
