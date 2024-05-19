import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux"
import { setToken, setUser } from '../redux/userSlice'

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [showpassword, setShowPassword] = useState(false)
  const [data, setData] = useState({
    email: "",
    password: ""
  })



  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }

    })
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const URL = `${import.meta.env.VITE_REACT_BACKEND_URL}/api/auth/login`
    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: data,
        withCredentials: true
      })
      console.log("This is Login Response: ", response?.data)
      toast.success(response?.data?.message)

      if (response?.data?.success) {
        dispatch(setToken(response?.data?.data?.token))
        localStorage.setItem("token", response?.data?.data?.token)


        // clear the input field after submission
        setData({
          email: "",
          password: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 1000)

      }


    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <div className='mt-20'>
      <div className='bg-white w-full md:max-w-md max-w-sm rounded-3xl mx-auto overflow-hidden p-4  '>
        <div className='flex flex-col items-center justify-center gap-3'>
          <FaUser className='text-3xl' />
          <h3 className='text-xl md:text-2xl'>Log In</h3>
        </div>


        <form className='grid gap-4 mt-5' onSubmit={handleLogin}>

          {/* Email */}
          <div className='flex flex-col gap-1 '>
            <label htmlFor='email'>Email: </label>
            <input
              type='email'
              id="email"
              name='email'
              placeholder='Enter your email'
              value={data.email}
              onChange={handleOnChange}
              required
              className='input rounded-lg  input-bordered w-full max-w-md px-2 py-1 focus:outline-primary'
            />
          </div>

          {/* Password */}
          <div className='flex flex-col gap-1 '>
            <label htmlFor='password'>Password: </label>
            <div className='relative'>
              <input
                type={showpassword ? 'text' : 'password'}
                id="password"
                name='password'
                placeholder='Enter your password'
                value={data.password}
                onChange={handleOnChange}
                required
                className='input rounded-lg  input-bordered w-full max-w-md px-2 py-1 focus:outline-primary '
              />
              <div className='absolute top-1.5 right-3 text-lg'>
                {
                  showpassword ? <FaEyeSlash onClick={handleShowPassword} /> : <FaEye onClick={handleShowPassword} />
                }
              </div>
            </div>
            <div className='mt-1 '>
              <h3 className='text-sm text-blue-400 cursor-pointer hover:text-blue-500'>
                <Link to="/forgot-password">Forgot Password ?</Link>
              </h3>
            </div>
          </div>

          <button className="btn btn-primary bg-primary rounded-lg py-2 hover:bg-secondary active:bg-tertiary text-white leading-relaxed tracking-wide">Log In</button>
        </form>
        <p className='my-3 text-center'>Didn&apos;t have an Account ?
          <Link to='/signup' className='text-primary hover:text-secondary cursor-pointer'>Sign Up</Link>
        </p>
      </div>

    </div>
  )
}

export default Login