import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './footer'
import Home from './Home'
function Layout() {
  return (
    <>
    {/* <Home/> */}
   <Outlet/>
   <main/>
   <Footer/>
   </>
  )
}

export default Layout