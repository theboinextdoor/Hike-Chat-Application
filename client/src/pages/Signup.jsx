/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from "../helpers/uploadFile"
import toast from 'react-hot-toast';
import axios from 'axios';






const Signup = () => {

  // Required Hooks
  const navigate = useNavigate();
  const [uploadPhoto, setUploadPhoto] = useState("")
  const [showpassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setshowconfirmPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_pic: ""
  })

  // Page Functionality
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleConfirmShowPassword = () => {
    setshowconfirmPassword((prev) => !prev)
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


  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadPhotoforCloud = await uploadFile(file)

    // console.log("Upload Photo", uploadPhotoforCloud)
    setUploadPhoto(file)

    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadPhotoforCloud?.url
      }
    })


  }

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation()
    setUploadPhoto(null)
  }

  // Handle API
  const handleSignup = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (data.password.length >= 5) {
      try {
        const URL = `${import.meta.env.VITE_REACT_BACKEND_URL}/api/auth/signup`;
        const response = await axios.post(URL, data);
        console.log("This is the response : ", response)

        if (response.error) {
          throw new Error;
        }

        // clear the input field after submission
        if (response?.data?.success) {
          setData({
            name: "",
            email: "",
            password: "",
            profile_pic: "",
            confirmPassword: ""
          });
          setUploadPhoto(null);

          setTimeout(() => {
            toast.success(response?.data?.message)
            navigate("/login")
          }, 1000)
        }
      } catch (error) {
        toast.error(error?.response?.data.message)
      }
    } else {
      toast.error("Password must greater than 6 digit")
    }
  }


  return (
    <div className='mt-5'>
      <div className='bg-white w-full md:max-w-md max-w-sm rounded-3xl mx-auto overflow-hidden p-4  '>
        <div className='flex flex-col items-center justify-center gap-3'>
          <FaUser className='text-3xl' />
          <h3 className='text-xl md:text-2xl'>Sign Up</h3>
        </div>


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
              className='input rounded-lg  input-bordered w-full max-w-md px-2 py-1 focus:outline-primary'
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

          {/*Confirm  Password */}
          <div className='flex flex-col gap-1 '>
            <label htmlFor='password'>Confirm Password: </label>
            <div className='relative '>
              <input
                type={showconfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name='confirmPassword'
                placeholder='Confirm Password'
                value={data.confirmPassword}
                onChange={handleOnChange}
                required
                className='input rounded-lg  input-bordered w-full max-w-md px-2 py-1 focus:outline-primary'
              />
              <div className='absolute top-1.5 right-3 text-lg'>
                {
                  showconfirmPassword ? <FaEyeSlash onClick={handleConfirmShowPassword} /> : <FaEye onClick={handleConfirmShowPassword} />
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
              // value={data.profile_pic}
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



