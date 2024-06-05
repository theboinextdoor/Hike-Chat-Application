import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearUser, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import logo from "../assets/logoo.png"
import io from "socket.io-client"

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  // console.log("Redux-User" , user)
  const location = useLocation();


  const fetchUserDetails  = async() =>{
    try{
      const URL = `${import.meta.env.VITE_REACT_BACKEND_URL}/api/auth/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true
      })
      // console.log("This is Response : " , response?.data?.data)
      dispatch(setUser(response?.data?.data))

      if(response?.data?.logout){
        dispatch(clearUser())
        navigate('/login')
      }
    }catch(error){
      console.log("Error",error)
    }
  }

  useEffect(() =>{
    fetchUserDetails()
  },[])


  //* socket connection
  useEffect(() =>{
    const socketConnection = io(import.meta.env.VITE_REACT_BACKEND_URL, {
      auth : {
        token : localStorage.getItem('token')
      }
    });

    socketConnection.on("onlineUser", (data)=>{
        console.log("User is Online ")
        console.log(data)
        dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return ()=>{
      socketConnection.disconnect();
    }
  },[])


  // console.log(location)
  const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
        {/* Sidebar */}
      <section className={`bg-white ${!basePath && "hidden" } lg:block`}>
        <Sidebar />
      </section>

      {/* Message Components */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
        <div className='flex flex-col items-center justify-center'>
          <img src={logo} alt="logo" width={300} />
          <p className='font-medium text-xl'>Where Conversations Come <span className='text-primary'>Alive</span></p>
        </div>
      </div>
    </div>
  )
}

export default Home