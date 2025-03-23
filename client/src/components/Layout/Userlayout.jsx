import React from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'

const Userlayout = () => {
  return (
    <>
    <Header />
    <main>
    <Outlet /> {/* This is where the child routes will render */}
    </main>
    {/* Main Content */}
    <Footer />
   </>
  )
}

export default Userlayout
