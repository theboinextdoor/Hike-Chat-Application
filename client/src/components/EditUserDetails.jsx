import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helpers/uploadFile'
import Divider from './Divider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const EditUserDetails = ({ onClose, user }) => {
     const [data, setData] = useState({
          name: user?.name,
          profile_pic: user?.profile_pic
     })
     const dispatch = useDispatch();

     const uploadPhoto = useRef();

     useEffect(() => {
          setData({
            name: user?.name || '',
            profile_pic: user?.profile_pic || ''
          }); // Fixed: Ensure state is properly updated
        }, [user]);

     const handleOnChange = (e) => {
          const { name, value } = e.target;
          setData((prev) => {
               return {
                    ...prev,
                    [name]: value
               }
          })
     }

     const handleUploadPhoto = async (e) => {
          const file = e.target.files[0];
          if (file) {
            const uploadPhotoforCloud = await uploadFile(file);
            setData((prev) => ({
              ...prev,
              profile_pic: uploadPhotoforCloud?.url
            }));
            toast.success("Profile Pic Changed")
          }
        };

     const handleSubmit = async (e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
               const URL = `${import.meta.env.VITE_REACT_BACKEND_URL}/api/auth/update-user`;
               const response = await axios({
                    method: "post",
                    url: URL,
                    data: data,
                    withCredentials: true
                  })
               console.log(response)
               toast.success(response?.data?.message)

               if(response?.data?.success){
                    dispatch(setData(response?.data?.data))
               }
               
               onClose()
          } catch (error) {
               toast.error(error?.message)
               console.log(error)
          }
     }

     const hanldeOpenUploadPhoto = (e) => {
          e.preventDefault();
          e.stopPropagation();
          uploadPhoto.current.click();
     }
     return (
          <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center'>
               <div className='bg-white p-4 py-6m-1 rounded-lg w-full max-w-sm '>
                    <h2 className='font-semibold text-primary'>Profile Detail</h2>
                    <p className='text-sm'>User detail</p>

                    <form className='grig gap-3 mt-3' onSubmit={handleSubmit}>

                         {/*  */}
                         <div className='flex flex-col gap-'>
                              <label htmlFor="name">Name: </label>
                              <input
                                   type="text"
                                   name='name'
                                   id="name"
                                   value={data.name}
                                   className='input input-bordered px-2 py-1 w-full rounded-full outline-none bg-slate-300 focus:outline-primary '
                                   onChange={handleOnChange}
                              />
                         </div>

                         <div className='mt-2'>
                              <div>Photo:</div>
                              <div className='my-1 flex items-center gap-4'>
                                   <Avatar
                                        width={40}
                                        height={40}
                                        name={user?.name}
                                        imageUrl={user?.profile_pic}
                                   />

                                   <label htmlFor="profile_pic">
                                        <button className='font-semibold' onClick={hanldeOpenUploadPhoto}>Change Profile Pic</button>
                                        <input
                                             type="file"
                                             className='hidden'
                                             ref={uploadPhoto}
                                             id="profile_pic"
                                             onChange={handleUploadPhoto} />
                                   </label>
                              </div>
                         </div>

                         <Divider />

                         <div className='flex gap-2 w-fit ml-auto mt-3'>
                              <button className='border-primary text-primary cursor-pointer border px-4 py-1 rounded-md hover:bg-primary hover:text-white' onClick={onClose}>Cancel</button>

                              <button className='border-primary bg-primary cursor-pointer text-white border px-4 py-1 rounded-md hover:bg-secondary hover:text-white' onClick={handleSubmit}>Save</button>
                         </div>
                    </form>
               </div >

          </div >
     )
}

export default React.memo(EditUserDetails)