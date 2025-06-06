import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();
const AdminContextProvider = (props)=>{

    const [aToken, setAtoken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken') : "")
  const [doctors, setDoctors] = useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL
     
    const getAllDoctors = async () => {
        try{
      const {data} = await axios.post(backendUrl + '/api/admin/all-doctors' , {}, {headers:
       {aToken}
      })
      if(data.success){
        setDoctors(data.doctors)
        console.log(data.doctors)
      } else{
        toast.error(data.message)
      }
        }catch(error){
            toast.error(error.message)
           console.log(error) 
        }
    }

    const changeAvailability = async (docId)=>{
      try {
const {data} = await axios.post(backendUrl + '/api/admin/change',{docId}, {
  headers: {aToken}
})

if(data.success){
  toast.success(data.message)
  getAllDoctors()
} else{
  toast.error(data.message)
}
      } catch(error){
        toast.error(error.message)
        console.log(error)
      }
    }

    const value = {
aToken,setAtoken,
backendUrl,doctors,
getAllDoctors,changeAvailability 
    }
return (
    <AdminContext.Provider value={value}>
        {
            props.children
        }
    </AdminContext.Provider>
)

}

export default AdminContextProvider