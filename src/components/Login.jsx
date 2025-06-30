import React,{useState} from 'react'
import * as SVG from '../SVG/Svg'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  
  const [emailId,setEmailId] =  useState("ashar050488@gmail.com");
  const [password,setPassword] =  useState("Ash1234@")
  
  const dispatch =useDispatch();
  const navigate = useNavigate()

  const handleLogin = async () => {
  try {
    const res = await axios.post(
      'http://localhost:7777/login',
      {
        emailId, // ✅ correct key name
        password
      },
      {
        withCredentials: true // ✅ correct placement
      }
    );
    dispatch(addUser(res.data.user));
    return navigate('/');
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
  }
};


  return (
    <div className='flex justify-center my-10'>
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body ">
          <h2 className="card-title mb-5 justify-center">Login</h2>
          <div className=' flex flex-col justify-center ml-2 gap-4'>

            <div>
              <label className="input validator">
                <input 
                type="email" 
                placeholder="mail@site.com" 
                required
                value={emailId}
                onChange={(e)=>setEmailId(e.target.value)}
                 />
                {SVG.mail}
              </label>
              <div className="validator-hint hidden">Enter valid email address</div>
            </div>


            <div>
              <label className="input validator">
                
                <input
                  type="password"
                  required
                 value={password}
                onChange={(e)=>setPassword(e.target.value)}
                  placeholder="Password"
                  minLength="8"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                />
                {SVG.key}
              </label>
              <p className="validator-hint hidden">
                Must be more than 8 characters, including
                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
              </p>
            </div>

          </div>




          <div>
            <div className="card-actions justify-center mt-5">
              <button className="btn btn-primary" onClick={handleLogin}>Login</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login
