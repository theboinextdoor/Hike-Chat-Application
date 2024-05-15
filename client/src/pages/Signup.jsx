import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';
const Signup = () => {

  // Page Functionality
  const [showpassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    profile_pic: ""
  })
  const [uploadPhoto, setUploadPhoto] = useState("")

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }
  const handleConfirmShowPassword = () => {
    setshowConfirmPassword((prev) => !prev)
  }
  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,

      }
    })
  }

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    setUploadPhoto(file)
  }

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation()
    setUploadPhoto(null)
  }


  // Handle API
  const handleSignup = (e) => {
    e.preventDefault();
    e.stopPropagation()
  }




  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-sm rounded-3xl overflow-hidden p-4 mx-auto '>
        <h3 className='text-2xl'>Welcome to Hike </h3>


        <form className='grid gap-4 mt-5' onSubmit={handleSignup}>

          {/* Name */}
          <div className='flex flex-col gap-1 '>
            <label htmlFor='name'>Name: </label>
            <input
              type='text'
              id="name"
              name='name'
              placeholder='Enter your name'
              value={data.name}
              onChange={handleOnChange}
              required
              className='input rounded-lg  input-bordered w-full max-w-xs px-2 py-1 focus:outline-primary'
            />
          </div>

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
              className='input rounded-lg  input-bordered w-full max-w-xs px-2 py-1 focus:outline-primary'
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
                className='input rounded-lg  input-bordered w-full max-w-xs px-2 py-1 focus:outline-primary '
              />
              <div className='absolute top-1.5 right-12 text-lg'>
                {
                  showpassword ? <FaEyeSlash onClick={handleShowPassword} /> : <FaEye onClick={handleShowPassword} />
                }
              </div>
            </div>
          </div>

          {/*Confirm  Password */}
          <div className='flex flex-col gap-1 '>
            <label htmlFor='password'>Confirm Password: </label>
            <div className='relative '>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmpassword"
                name='confirmpassword'
                placeholder='Confirm Password'
                value={data.confirmpassword}
                onChange={handleOnChange}
                required
                className='input rounded-lg  input-bordered w-full max-w-xs px-2 py-1 focus:outline-primary'
              />
              <div className='absolute top-1.5 right-12 text-lg'>
                {
                  showConfirmPassword ? <FaEyeSlash onClick={handleConfirmShowPassword} /> : <FaEye onClick={handleConfirmShowPassword} />
                }
              </div>
            </div>
          </div>

          {/*Profile Pic */}
          <div className='flex flex-col gap-1 '>
            <label htmlFor='profile_pic'>Photo:

              <div className='h-14 bg-slate-200 flex justify-center items-center border rounded-lg hover:border-primary cursor-pointer'>
                <p className='text-sm max-w-[300] text-ellipsis line-clamp-1'>
                  {
                    uploadPhoto ? uploadPhoto?.name : "Upload  Photo"
                  }
                  {
                    uploadPhoto?.name && (<button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
                      <RxCross2 />
                    </button>)
                  }

                </p>
              </div>


            </label>
            <input
              type='file'
              id="profile_pic"
              name='profile_pic'
              value={data.profile_pic}
              className='hidden bg-slate-100 px-2 py1 focus:outline-primary '
              onChange={handleUploadPhoto}

            />
          </div>

          <button className="btn btn-primary bg-primary rounded-lg py-2 hover:bg-secondary active:bg-tertiary text-white leading-relaxed tracking-wide">Signup</button>
        </form>
        <p className='my-3 text-center'>Already have an Account ?
          <Link to='/login' className='text-primary hover:text-secondary cursor-pointer'>Login</Link>
        </p>
      </div>

    </div>
  )
}

export default Signup