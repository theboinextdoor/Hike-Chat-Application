import axios from 'axios'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Login = () => {
  const [showpassword , setShowPassword] = useState(false)
  const [data , setData] = useState({
    email : "",
    password : ""
  })

 

  const handleShowPassword = () =>{
    setShowPassword((prev) => !prev)
  }

  const handleOnChange = (e) =>{
    e.preventDefault();
    const {name , value} = e.target;
    setData((prev) =>{
      return {
        ...prev,
        [name] : value
      }
    })
  }

  const handleLogin = async(e) =>{
    e.preventDefault();
    console.log(data)

    const URL = `${import.meta.env.VITE_REACT_BACKEND_URL}/auth/login`
    try{
      const response = await axios.post(URL, data)
      console.log("This is Login Response : ", response)
    }catch(error){
      console.log(error?.response?.data?.message)
    }
  }
  return (
    <div className='mt-20'>
      <div className='bg-white w-full md:max-w-md max-w-sm rounded-3xl mx-auto overflow-hidden p-4  '>
        <h3 className='text-2xl'>Log In</h3>


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
          </div>

         

         
          <button className="btn btn-primary bg-primary rounded-lg py-2 hover:bg-secondary active:bg-tertiary text-white leading-relaxed tracking-wide">Signup</button>
        </form>
        <p className='my-3 text-center'>Didn&apos;t have an Account ?
          <Link to='/signup' className='text-primary hover:text-secondary cursor-pointer'>Sign Up</Link>
        </p>
      </div>

    </div>
  )
}

export default Login