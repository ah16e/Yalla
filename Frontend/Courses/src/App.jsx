import './index.css'
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Layout from './components/layouts/Layout'
import MyAppointment from './components/pages/MyAppointment'
import MyProfile from './components/pages/MyProfile'
import { TeacherProvider } from './contexts/Teacher'
import TeacherProfile from './components/Teacher/TeacherProfile'
import PrivateRoute from './components/PrivteRoute/PrivteRoutes'
import { AuthProvider } from './contexts/AuthContext'
import { ToastContainer } from 'react-toastify'
import FindTeacher from './components/pages/FindTeacher'
import AboutUs from './components/pages/AboutUs'
import Contact from './components/pages/Contact'
import AdminDashboard from './components/pages/AdminDashboard'
import ForgotPassword from './components/ForgotPassword/ForgotPassword'
import ResetPassword from './components/ForgotPassword/ResetPassword'

let routers =  createBrowserRouter([
    {path: '/' , element: <Layout/> , children: [
    {index: true , element: <Home/>},
    {path: 'login' , element: <Login/>},
    {path: 'register' , element: <Register/>},
    {path: 'register' , element: <Register/>},
    {path: 'about-us' , element: <AboutUs/>},
    {path: 'contact' , element: <Contact/>},
    {path:'/teacher/:id' , element: <PrivateRoute><TeacherProfile/></PrivateRoute>},
    {path:'/findteacher' , element: <PrivateRoute><FindTeacher/></PrivateRoute>},
    {path: 'myappointment/:id' , element: <PrivateRoute><MyAppointment/></PrivateRoute>},
    {path:  'myprofile' , element: <PrivateRoute><MyProfile/></PrivateRoute>},
    {path:  'admin' , element: <PrivateRoute><AdminDashboard/></PrivateRoute>},
    {path: '/forgot-password' , element: <ForgotPassword/>},
    {path: '/reset-password/:token' , element: <ResetPassword/>},
  ]}
])

function App() {
  return (
    <>
    <AuthProvider>
    <TeacherProvider>
    <RouterProvider router={routers}></RouterProvider>
    </TeacherProvider>
    </AuthProvider>
    <ToastContainer/>
    </>
  )
}

export default App
