import React from 'react'
import Hero from '../Layout/Hero'
import GenderCollectionSection from '../Products/GenderCollectionSection'
import NewArrivals from '../Products/NewArrivals'
import ProductDetails from '../Products/ProductDetails.jsx'   
import ProductGrid from '../Products/ProductGrid.jsx'
import FeaturedCollection from '../Products/FeaturedCollection.jsx'
import FeaturesSection from '../Products/FeaturesSection.jsx'

const PlaceHoldersProducts = [
  {
    _id: 1,
    name: "Product 1",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=2" }],
  },
  {
    _id: 2,
    name: "Product 2",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=3" }],
  },
  {
    _id: 3,
    name: "Product 3",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=4" }],
  },
  {
    _id: 4,
    name: "Product 4",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=6" }],
  },
  {
    _id: 5,
    name: "Product 5",
    price: 120,
    images: [{ url: "https://picsum.photos/500/500?random=7" }],
  },
  {
    _id: 6,
    name: "Product 6",
    price: 130,
    images: [{ url: "https://picsum.photos/500/500?random=8" }],
  },
  {
    _id: 7,
    name: "Product 7",
    price: 140,
    images: [{ url: "https://picsum.photos/500/500?random=9" }],
  },
  {
    _id: 8,
    name: "Product 8",
    price: 150,
    images: [{ url: "https://picsum.photos/500/500?random=10" }],
  },
];


const Home = () => {
  return (
    <div className=''>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />
      <h2 className='text-3xl text-center font-bold mb-4' >Best Seller</h2>
      <ProductDetails />
      <div className='container mx-auto'>
        <h2 className="text-3xl text-center font-bold  mb-4"> Top Wears For Women</h2>
      <ProductGrid products={PlaceHoldersProducts}/>
      </div>
      <FeaturedCollection />
      <FeaturesSection />
    </div>
  )
}

export default Home
