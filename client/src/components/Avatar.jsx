import React from 'react'
import { FaUser } from 'react-icons/fa';

const Avatar = ({ userId, name, imageUrl, width, height }) => {

     let avatarName = "";
     if (name) {
          const splitName = name?.split(" ");
          if (splitName.length > 1) {
               avatarName = splitName[0][0] + splitName[1][0];
          } else {
               avatarName = splitName[0][0];
          }
     }

     const bgColor = [
          'bg-slate-300',
          'bg-red-300',
          'bg-teal-300',
          'bg-green-300',
          'bg-sky-300',
          'bg-yellow-300',
          'bg-cyan-300',
          'bg-gray-300',
          'bg-blue-300'
     ]

     const randomNumber = Math.floor(Math.random() * 9)

     return (
          <div className={`overflow-hidden rounded-full shadow border text-xl font-semibold ${bgColor[randomNumber]}`} style={{ width: width + "px", height: height + "px" }}>
               {
                    imageUrl ? (
                         <img
                              src={imageUrl}
                              alt="user-image"
                              width={width}
                              height={height}
                              className='overflow-hidden rounded-full'
                         />
                    ) : (
                         name ? (
                              <div 
                                   className={`overflow-hidden rounded-full flex items-center justify-center text-black ${bgColor[randomNumber]}`} 
                                   style={{ width: width + "px", height: height + "px" }}>
                                   {avatarName}
                              </div>
                         ) : (
                              <FaUser size={width} className='text-black' />
                         )
                    )
               }
          </div>
     )
}

export default Avatar;