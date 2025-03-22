import React from 'react'
import Navbar from './Navbar'
import Topbar from '../Layout/Topbar'

const Header = () => {
  return (
    <div className='border border-b-gray-300 '>
      <Topbar />  
      <Navbar />
    </div>
  )
}

export default Header
