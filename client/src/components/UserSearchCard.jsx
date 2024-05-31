import React from 'react'
import Avatar from "./Avatar"
import { Link } from 'react-router-dom'

const UserSearchCard = ({user , onClose}) => {
  return (
    <Link to={"/"+user?._id} onClick={onClose} className='flex items-center gap-3 p-2 border border-transparent border-b-slate-300 lg:p-4 cursor-pointer hover:border hover:bg-sky-100 rounded-xl'>
      <div>
        <Avatar 
            width={50}
            height={50}
            name={user.name}
          />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
          {user?.name}
        </div>
        <p className='tetx-sm text-ellipsis line-clamp-1 '>{user?.email}</p>
      </div>
    </Link>
  )
}

export default UserSearchCard