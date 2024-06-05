import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar"
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import SearchUser from './SearchUser';
import { FaImage } from "react-icons/fa6";
import { IoIosVideocam } from "react-icons/io";
import { clearUser } from '../redux/userSlice';


const Sidebar = () => {
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const user = useSelector(state => state?.user);
     const [allUser, setAllUser] = useState([])
     const [openSearchUser, setOpenSearchUser] = useState(false)
     const socketConnection = useSelector(state => state?.user?.socketConnection)

     useEffect(() => {
          if (socketConnection) {
               socketConnection.emit('sidebar', user._id)

               socketConnection.on('conversation', (data) => {

                    const conversationUserData = data.map((conversationUser, index) => {
                         if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
                              return {
                                   ...conversationUser,
                                   userDetails: conversationUser?.sender
                              }
                         } else if (conversationUser?.receiver?._id != user?._id) {
                              return {
                                   ...conversationUser,
                                   userDetails: conversationUser.receiver
                              }
                         } else {
                              return {
                                   ...conversationUser,
                                   userDetails: conversationUser.sender
                              }
                         }

                    })
                    setAllUser(conversationUserData)
               })
          }
     }, [socketConnection, user])

     const handleLogout = () =>{
          dispatch(clearUser())
          navigate("/login")
          localStorage.clear()
     }
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
                              <Avatar
                                   width={30}
                                   height={30}
                                   name={user?.name}
                                   userId={user?._id}
                                   imageUrl={user?.profile_pic}
                              />
                         </button>
                         <button title="Log out" className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-sky-600 rounded-lg' onClick={handleLogout}>
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
                         {
                              allUser.map((conv, index) => {
                                   return (
                                        <NavLink to={"/" + conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-2 py-3 px-2 border-b hover:bg-slate-200 hover:cursor-pointer'>
                                             <div>
                                                  <Avatar
                                                       imageUrl={conv?.userDetails?.profile_pic}
                                                       name={conv?.userDetails?.name}
                                                       width={35}
                                                       height={35}
                                                  />
                                             </div>
                                             <div>
                                                  <h3 className='text-ellipsis line-clamp-1 font-semibold text-base '>{conv.userDetails?.name}</h3>
                                                  <div className='text-slate-500 text-xs  flex ga-1 items-center'>
                                                       <div className='flex items-center gap-1'>
                                                            {
                                                                 conv?.lastMsg?.imageUrl && (
                                                                      <div className='flex items-center  gap-1' >
                                                                           <span ><FaImage /></span>
                                                                           {!conv?.lastMsg?.text && <span>Image</span>}
                                                                      </div>
                                                                 )
                                                            }
                                                            {
                                                                 conv?.lastMsg?.videoUrl && (
                                                                      <div className='flex items-center  gap-1' >
                                                                           <span ><IoIosVideocam /></span>
                                                                           {!conv?.lastMsg?.text && <span>Video</span>}
                                                                      </div>
                                                                 )
                                                            }
                                                       </div>
                                                       <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                                                  </div>
                                             </div>
                                             {
                                                 Boolean( conv?.unseenMsg) && (
                                                       <p className='text-xs w-6 h-6 ml-auto p-1 bg-primary text-white  font-semibold rounded-full flex justify-center items-center'>{conv?.unseenMsg}</p>
                                                  )
                                             }

                                        </NavLink>
                                   )
                              })
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