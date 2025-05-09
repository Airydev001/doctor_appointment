import React from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import {useNavigate} from 'react-router-dom'
export const Navbar = () => {

    const {aToken,setAtoken} = useContext(AdminContext)

    const navigate = useNavigate()

    const logout = ()=>{
        navigate('/')
        aToken && setAtoken('')
        aToken && localStorage.removeItem('aToken')
    }
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>

        <div className='flex items-center gap-2 text-xs '>
            <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' :'Doctor'}</p>
        </div>
        <button onClick={logout} className='bg-blue-400 text-white text-sm px-10 py-2 rounded-full '>Logout</button>
    </div>
  )
}
