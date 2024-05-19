import { createSlice } from "@reduxjs/toolkit";

const initialState = {
     _id : "",
     name: "",
     email : "",
     profile_pic : "",
     token : ""
}
export const userSlice = createSlice({
     name: "user",
     initialState,
     reducers:{
          setUser: (state , action) =>{
               state._id = action.payload._id
               state.name = action.payload.name
               state.email = action.payload.email
               state.profile_pic = action.payload.profile_pic
          },
          setToken : (state , action) =>{
               state.token = action.payload
          },
          clearUser : (state , action) =>{
               state._id = ""
               state.name = ""
               state.email = ""
               state.profile_pic = ""
               state.token = ""
          }
     }
}) 


export const {setUser , setToken , clearUser} = userSlice.actions

export default userSlice.reducer     // this is the user Reducer