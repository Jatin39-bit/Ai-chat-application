/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/user.context";
import axios from "../config/axios";
import Loader from "../components/Loader";
const ProtectWrapper = ({children}) => {
    const [loading, setLoaidng] = useState(true)
    const { setUser } = useContext(userContext);
    const token=localStorage.getItem('token')
    const navigate=useNavigate()


    useEffect(()=>{ 
        if(!token){
            navigate('/login')
        }
        const fetchUser=async()=>{
            try{
                const response= await axios.get('/user/profile',{headers:{Authorization:`Bearer ${token}`}})
                setUser(response.data.user)
                setLoaidng(false)
            }catch(err){
                setLoaidng(false)
                localStorage.removeItem('token')
                console.log(err)
                navigate('/login')
            }
        }
        fetchUser()

    },[token])


    if(loading){
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader fullScreen size="xl" />
            </div>
        )
    }


  return (
    <>
        {children}  
    </>
  )
}

export default ProtectWrapper