import React from 'react'
import Hero from '../Layout/Hero'
import GenderCollectionSection from '../Products/GenderCollectionSection'
import NewArrivals from '../Products/NewArrivals'
import ProductDetails from '../Products/ProductDetails.jsx'   

const Home = () => {
  return (
    <div className=''>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      <h2 className='text-3xl text-center font-bold mb-4' >Best Seller</h2>
      <ProductDetails />
    </div>
  )
}

export default Home
