import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice"
import socketMiddleware from '../middlewares/socket.middleware'

export const store = configureStore({
  reducer: {
     user : userReducer
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(socketMiddleware),
})