import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoChevronBack } from "react-icons/io5";
import { FaPlus, FaImage } from "react-icons/fa6";
import { IoIosVideocam } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import uploadFile from '../helpers/uploadFile';
import Avatar from './Avatar'
import Loading from "./Loading"
import toast from "react-hot-toast"
import backgroundImage from "../assets/chatbg.png"
import { BsFillSendFill } from "react-icons/bs";
import moment from 'moment/moment';

const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user)
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  })
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  })
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([])
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [allMessage])



  const handleOpenImageVideoUpload = () => {
    setOpenImageVideoUpload((prev) => !prev)
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    try {
      setLoading(true);
      const uploadPhoto = await uploadFile(file);
      setLoading(false);
      setOpenImageVideoUpload(false);

      if (uploadPhoto && uploadPhoto.url) {
        setMessage((prev) => {
          return {
            ...prev,
            imageUrl: uploadPhoto.url
          }
        });
      } else {
        console.error('Error uploading image:', uploadPhoto);
      }
    } catch (error) {
      toast.error("Internal Error occured")
      console.error('Error uploading image:', error);
      setLoading(false);
    }
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadPhoto.url
      }
    })
  }

  const handleClearUploadImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      }
    })
    setOpenImageVideoUpload((prev) => !prev)
    console.log("Handle clear image is desabled")
  }


  const handleClearUploadVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      }
    })
    setOpenImageVideoUpload((prev) => !prev)
    console.log("Handle clear video is disabled")
  }

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId)
      socketConnection.emit('seen' , params.userId)

      socketConnection.on("message-user", (data) => {
        console.log("user details :", data)
        setDataUser(data)
      })

      socketConnection.on('message', (data) => {
        console.log("All the Messages : ", data)
        setAllMessage(data)
      })


    }

  }, [socketConnection, params.userId, user])

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage((prev) => {
      return {
        ...prev,
        text: value
      }
    })

  }

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        })
        setMessage(
          {
            text: "",
            imageUrl: "",
            videoUrl: "",
          }
        )
      }
    }


  }

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className='bg-no-repeat bg-left-top bg-cover md:bg-right '>
      <header className='sticky top-0 h-16 bg-primary flex justify-between items-center px-4'>
        <div className='flex items-center gap-4 p-2'>
          <Link to="/" className='lg:hidden'>
            <IoChevronBack size={20} />
          </Link>
          <div >
            <Avatar
              height={50}
              width={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='-my-1 '>{
              dataUser.online ? <span className='text-green-400'>online</span> : <span className='text-white'>offline</span>
            }</p>
          </div>
        </div>
        <div className=''>
          <button className='cursor-pointer '><BsThreeDotsVertical className='text-2xl text-white hover:text-black' /></button>
        </div>
      </header>


      {/* show all message */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-10'>


        {/* all messages */}
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {
            allMessage.map((msg, index) => {
              return (
                <div key={index} className={` py-2 w-fit rounded-md max-w-[]280px] md:max-w-sm lg:max-w-md ${user._id === msg.msgByUserId ? "ml-auto  bg-blue-300" : "bg-blue-200"}`}>
                  <div className="w-full ">
                    {
                      msg?.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          className='w-full h-full object-scale-down'
                        />
                      )
                    }
                  {
                      msg?.videoUrl && (
                        <video
                          src={msg.videoUrl}
                          className='w-full h-full object-scale-down'
                          controls
                        />
                      )
                    }
                  </div>
                  <p className='px-2 font-semibold'>{msg.text}</p>
                  <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format("hh:mm")}</p>
                </div>
              )
            })
          }
        </div>

        {/* Upload Image Display */}
        {
          message.imageUrl && (
            <div className='w-full h-full sticky bottom-0 bg-cover bg-center bg-slate-700 bg-opacity-30 backdrop-blur-sm flex items-center justify-center rounded overflow-hidden'>

              <div
                className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary'
                onClick={handleClearUploadImage}>
                <RxCross2 size={30} />
              </div>

              <div className='bg-white p-3'>
                <img
                  src={message.imageUrl}
                  alt="upload-image"
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                />
              </div>

            </div>
          )
        }
        {
          message.videoUrl && (
            <div className='w-full h-full sticky bottom-0  bg-cover bg-center bg-slate-700 bg-opacity-30 backdrop-blur-sm flex items-center justify-center rounded overflow-hidden'>

              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary' onClick={handleClearUploadVideo}>
                <RxCross2 size={30} />
              </div>

              <div className='bg-white p-3'>
                <video
                  src={message.videoUrl}
                  alt="upload-video"
                  className='aspect-video w-full h-full max-w-sm m-2 object-scale-down'
                  controls
                  muted
                  autoPlay
                />
              </div>

            </div>
          )
        }
        {
          loading && (
            <div className='w-full h-full flex justify-center items-center'>
              <Loading />
            </div>
          )
        }
      </section>


      {/* send message */}
      <section className='h-16 bg-white flex items-center p-4'>
        <div className='relative '>
          <button className='flex justify-center items-center w-12 h-12 rounded-full hover:bg-primary ' onClick={handleOpenImageVideoUpload}>
            <FaPlus size={20} />
          </button>

          {/* video and image popup option */}
          {
            openImageVideoUpload && (
              <div className='bg-white shadow rounded-lg absolute bottom-14 w-36 p-2 '>
                <form >
                  <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-primary'>
                      <FaImage size={18} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label htmlFor='uploadVideo' className='flex items-center p-2 gap-3  hover:bg-slate-200 cursor-pointer '>
                    <div className='text-primary'>
                      <IoIosVideocam size={18} />
                    </div>
                    <p>Video</p>
                  </label>

                  <input
                    type="file"
                    id="uploadImage"
                    className='hidden'
                    onClick={handleUploadImage} />
                  <input
                    type="file"
                    id="uploadVideo"
                    className='hidden'
                    onClick={handleUploadVideo} />
                </form>

              </div>
            )
          }
        </div>

        {/* input box */}
        <form className='h-full w-full flex gap-2 ' onSubmit={handleSendMessage}>
          <input
            type="text"
            className='py-1 px-4 outline-none w-full h-full '
            placeholder='Type Your Message.......'
            value={message.text}
            onChange={handleOnChange}
          />
          <button className='hover:text-primary'>
            <BsFillSendFill size={25} />
          </button>
        </form>
      </section>
    </div>
  )
}

export default MessagePage