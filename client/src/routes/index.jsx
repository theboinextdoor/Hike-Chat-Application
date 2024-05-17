import React from 'react'
import {createBrowserRouter} from "react-router-dom" 
import Home from '../pages/Home'
import App from '../App'
import Signup from '../pages/Signup'
import Login from '../pages/Login'
import MessagePage from '../components/MessagePage'
import AuthLayout from '../layout/AuthLayout'
import ForgotPassword from '../pages/ForgotPassword'

const router = createBrowserRouter([
     {
          path: "/",
          element: <App/>,
          children : [
               {
                    path : "/",
                    element : <Home />,
                    children : [
                         {
                              path: "/:userId",
                              element : <MessagePage />
                         }
                    ]
               },
               {
                    path: "/signup",
                    element: <AuthLayout><Signup /></AuthLayout>
               },
               {
                    path: "/login",
                    element : <AuthLayout><Login /></AuthLayout>
               },
               {
                    path: "/forgot-password",
                    element : <AuthLayout><ForgotPassword /></AuthLayout>
               }
          ]
     }
])


export default router;