import React, { use } from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Feed from './Feed'
import axios from 'axios'
import { baseURL } from '../api/API'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(baseURL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if(err.status === 401){
        navigate("/login");
      }
      console.error(err);
    }
  };

  useEffect(() => {
      fetchUser();
  }, []);

  return (
    <div>
      <NavBar />
      <Outlet />
      {/* <Feed /> */}
    </div>
  );
};
export default Body;
