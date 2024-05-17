import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const useSignupInput = async (data) => {
     const [loading , setLoading] = useState(false)
     const [fetchData , setFetchData] = useState("")
     const URL = `${import.meta.env.VITE_REACT_BACKEND_URL}/api/auth/signup`;


     // configuration
     setLoading(true)
     try {
          if (data.email && data.name) {
               if (data.password !== data.confirmPassword) {
                    if (data.password.length > 6) {
                         const response = await axios.post(URL, data)
                         toast.success(response.data.message);
                         console.log("This is the response: ", response)
                    } else {
                         toast.error("Password lenght must be greater than 6");
                    }
               } else {
                    toast.error("Password didn't match")
               }
          } else {
               toast.error("Please fill all the fields")
          }
     } catch (error) {
          console.log("Error inside the useSignupInput")
          throw new Error(error?.response?.data?.message)
     }finally{
          setLoading(false);
     }

     return {loading} ;
}

export default useSignupInput;