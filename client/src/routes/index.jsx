import React from 'react'
import {createBrowserRouter, Navigate} from "react-router-dom" 
import Home from '../pages/Home'
import App from '../App'
import Signup from '../pages/Signup'
import Login from '../pages/Login'
import MessagePage from '../components/MessagePage'
import AuthLayout from '../layout/AuthLayout'
import ForgotPassword from '../pages/ForgotPassword'
import toast from 'react-hot-toast'


const ProtectedRoute = ({ children }) => {
     const isLoggedIn = localStorage.getItem('token');
     if (!isLoggedIn) {
       return <Navigate to="/login" replace />;
     }
     return children;
   };

   const PublicRoute = ({ children }) => {
     const isLoggedIn = localStorage.getItem('token');
     if (isLoggedIn) {
       return <Navigate to="/" replace />;
     }
     return children;
   };

const router = createBrowserRouter([
     {
          path: "/",
          element: <App/>,
          children : [
               {
                    path : "/",
                    element :(
                         <ProtectedRoute>
                           <Home />
                         </ProtectedRoute>
                       ),
                    children : [
                         {
                              path: "/:userId",
                              element : <MessagePage />
                         }
                    ]
               },
               {
                    path: "/signup",
                    element: (
                         <PublicRoute>
                           <AuthLayout><Signup /></AuthLayout>
                         </PublicRoute>
                       )
               },
               {
                    path: "/login",
                    element : (
                         <PublicRoute>
                           <AuthLayout><Login /></AuthLayout>
                         </PublicRoute>
                       )
               },
               {
                    path: "/forgot-password",
                    element : <AuthLayout><ForgotPassword /></AuthLayout>
               }
          ]
     }
])


export default router;