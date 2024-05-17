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
          'bg-slate-200',
          'bg-red-200',
          'bg-teal-200',
          'bg-green-200',
          'bg-sky-200',
          'bg-yellow-200',
          'bg-cyan-200',
          'bg-gray-200',
          'bg-blue-200'
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
                                   className={`overflow-hidden rounded-full flex items-center justify-center ${bgColor[randomNumber]}`} 
                                   style={{ width: width + "px", height: height + "px" }}>
                                   {avatarName}
                              </div>
                         ) : (
                              <FaUser size={width} />
                         )
                    )
               }
          </div>
     )
}

export default Avatar;