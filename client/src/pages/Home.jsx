import axios from 'axios';
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Home = () => {
  const fetchUserDetails  = async() =>{
    try{
      const URL = `${import.meta.env.VITE_REACT_BACKEND_URL}/api/auth/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true
      })
      console.log("This is coming from Uer Details : " , response)
    }catch(error){
      console.log("Error",error)
    }
  }

  useEffect(() =>{
    fetchUserDetails()
  },[])
  return (
    <div>
      Home

      {/* Message Components */}
      <section>
        <Outlet />
      </section>
    </div>
  )
}

export default Home