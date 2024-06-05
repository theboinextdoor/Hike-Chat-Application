import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from "react-hot-toast"
import { IoMdClose } from "react-icons/io";
import axios from "axios"

const SearchUser = ({ onClose }) => {
     const [searchUser, setSearchUser] = useState([]);
     const [loading, setLoading] = useState(false);
     const [search, setSearch] = useState("")

     const handleSearchUser = async () => {
          const URL = `${import.meta.env.VITE_REACT_BACKEND_URL}/api/user/search-user`;
          try {
               setLoading(true);
               const response = await axios.post(URL, {
                    search: search
               })
               setLoading();
               setSearchUser(response.data.data)
          } catch (error) {
               toast.error(error?.response?.data?.message)
          }
     }

     useEffect(() => {
          handleSearchUser()
     }, [search])

     // console.log("SearchUser : ", searchUser);


     return (
          <div className='fixed top-0  bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-3 z-10'>
               <div className='w-full max-w-md mx-auto mt-10 m-2'>

                    {/* Input User Name */}
                    <div className='bg-white rounded-lg h-14 flex overflow-hidden'>
                         <input
                              type="text"
                              placeholder='Search User by name , email....'
                              className='w-full outline-none py-1 h-full px-4 '
                              onChange={(e) => setSearch(e.target.value)}
                              value={search}
                         />

                         <div className='h-14 w-14 flex items-center justify-center'>
                              <IoSearchOutline
                                   className='cursor-pointer text-primary'
                                   size={25} />
                         </div>

                    </div>

                    {/* Display the search user */}
                    <div className="bg-white mt-2 w-full p-4 rounded-lg">
                         {/* No user found */}
                         {
                              searchUser.length === 0 && !loading && (
                                   <p className='text-center text-slate-500'>User not found</p>
                              )
                         }
                         {
                              loading && (
                                   <Loading />
                              )
                         }

                         {
                              searchUser.length > 0 && !loading && (
                                   searchUser.map((user, index) => {
                                        return (
                                             <UserSearchCard key={user._id} user={user} onClose={onClose} />
                                        )
                                   })
                              )
                         }
                    </div>
               </div>
               <div className='absolute top-0 right-0 text-2xl p-2 lg:text-3xl hover:text-primary text-white'>
                   <button onClick={onClose}>
                     <IoMdClose />
                     </button>
               </div>
          </div>
     )
}

export default SearchUser