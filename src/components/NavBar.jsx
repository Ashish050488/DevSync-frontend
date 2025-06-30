import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const NavBar = () => {
  const user = useSelector((store)=>store.user)
  const navigate = useNavigate();
  // console.log(user.user.photoUrl)

  return (
    <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">daisyUI</a>
  </div>
   {user && (  
  <div className="flex gap-2">
    <div className='form-control flex items-center px-4'>Welcome {user.firstName}</div>
 
    <div className="dropdown dropdown-end">
            
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
      
          <div className="w-10 rounded-full">
          <img
            alt="userPhoto"
            src={user.photoUrl} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between" onClick={() => navigate("/profile")}>
            profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
  )}
</div>
  )
}

export default NavBar
