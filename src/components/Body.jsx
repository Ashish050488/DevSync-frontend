"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../api/api";
import { addUser } from "../utils/userSlice";
import NavBar from "./NavBar";
import AuthPage from "./AuthPage";

const Body = () => {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);

  useEffect(() => {
    if (!userData) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(baseURL + "/profile/view", {
            withCredentials: true,
          });
          dispatch(addUser(res.data));
        } catch (err) {
          console.log("No active session found.");
        }
      };
      fetchUser();
    }
  }, [userData, dispatch]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white text-black">
      <header className="h-16 border-b border-black/10">
        <NavBar />
      </header>
      <main className="flex-1 overflow-auto bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          {userData ? <Outlet /> : <AuthPage />}
        </div>
      </main>
    </div>
  );
};

export default Body;