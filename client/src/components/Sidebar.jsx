import React, { useState } from 'react'
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar"
import { useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import SearchUser from './SearchUser';


const Sidebar = () => {
     const user = useSelector(state => state?.user);
     const [allUser, setAllUser] = useState([])
     const [openSearchUser, setOpenSearchUser] = useState(true)
     return (
          <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
               <div className='bg-primary h-full w-12 rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between text-white'>

                    {/* Top Icons */}
                    <div className=''>
                         <NavLink
                              title="chat"
                              className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-sky-600 rounded-lg ${isActive && "bg-sky-600"}`}>
                              <IoChatbubbleEllipsesSharp
                                   size={25}
                              />
                         </NavLink>
                         <div title="search user" className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-sky-600 rounded-lg'>
                              <FaUserPlus
                                   size={25}
                                   onClick={() => setOpenSearchUser(true)}
                              />
                         </div>
                    </div>


                    {/* Bottom Icons */}
                    <div className='flex flex-col items-center gap-3' >
                         <button className='mx-auto' title={user?.name}
                         // onClick={() => setEditUserOpen(true)}
                         >
                              <Avatar width={30} height={30} name={user?.name}
                                   imageUrl={user?.profile_pic}
                              />
                         </button>
                         <button title="Log out" className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-sky-600 rounded-lg'>
                              <span className='-ml-2'>
                                   <BiLogOut
                                        size={25}

                                   />
                              </span>
                         </button>
                    </div>
               </div>

               <div className="w-full ">

                    {/* Message Heading  */}
                    <div className='h-16 flex items-center'>
                         <h2 className='text-xl font-bold p-4 text-primary '>
                              Message
                         </h2>
                    </div>

                    {/* Divider */}
                    <div className='bg-slate-200 p-[0.5px]'></div>


                    {/* All User Conversation */}
                    <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-scroll scrollbar'>
                         {
                              allUser.length === 0 && (
                                   <div>
                                        <div>

                                        </div>
                                        <p className='text-center text-lg text-slate-400'>Explore User to start a conversation</p>
                                   </div>
                              )
                         }

                    </div>
               </div>

               {/* edit user details */}
               {/* {
                    editUserOpen  && (
                         <EditUserDetails 
                         onClose={() => setEditUserOpen(false)} 
                         user={user}/>
                    )
               } */}

               {/* Search User */}
               {
                    openSearchUser && (
                         <SearchUser onClose={() => setOpenSearchUser(false)} />
                    )
               }


          </div>
     )
}

export default Sidebar