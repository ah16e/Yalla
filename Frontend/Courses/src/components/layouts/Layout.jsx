import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
  return (
    <div>

      <Navbar/>
      <ToastContainer />
      <div className='min-h-screen mx-auto px-4 sm:px-6 lg:px-8 mt-5'>
        <Outlet></Outlet>
      </div>
      <Footer/>
    </div>
  )
}
