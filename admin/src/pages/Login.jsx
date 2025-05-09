import React, {useContext, useState} from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'


const Login = () => {

    const [state,setState] = useState('Admin')
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const {setAtoken,backendUrl} = useContext(AdminContext)

    const onSubmitHandler = async (event)=> {
event.preventDefault()

try {
if(state==="Admin"){
 const {data} = await axios.post(backendUrl+'/api/admin/login', {email,password})

 if(data.success){
    localStorage.setItem('aToken', data.token)
    setAtoken(data.token)
 } else{
    toast.error(data.message)
 }
} else {
   
  
console.log("failed to connect")
}
}catch(error){
console.log(error)
}
    }
    const breakingSpace = ' ';
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border-0 rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
            <p className='text-2xl font-semibold m-auto'>
                <span className='text-[#5f6fff]'>
                    {state}
                </span> 
                {breakingSpace} Login
            </p>
            <div className='w-full'>
                <p>Email</p>
                < input onChange={(e)=>setEmail(e.target.value)} className='border border-[#DADADA] rounded w-full p-2 mt-1' value={email} />
            </div>
            <div className='w-full'>
                <p>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} className='border border-[#DADADA] rounded w-full p-2 mt-1' value={password}/>
            </div>
          
            <button className='bg-blue-400 text-white w-full py-2 rounded-md text-base '>Login</button>
        {
           state === "Admin" ? <p>Doctor Login? <span className='text-blue-400 underline cursor-pointer' onClick={()=>setState("Doctor")}>Click here</span></p>
            :  <p>Admin Login <span className='text-blue-400 underline cursor-pointer'  onClick={()=>setState("Admin")}>Click here</span ></p>
        }
        </div>
       
    </form>
  )
}

export default Login