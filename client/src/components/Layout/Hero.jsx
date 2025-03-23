import React from 'react'
import heroImg from '../../assets/rabbit-hero.webp'
const Hero = () => {
  return (
    <section className='relative'>
      <img src={heroImg} alt="Rabbit img" className='w-screen h-[480px] md:h-[600px] lg:h-[750px] object-cover' />
    <div className=' text-center pt-36 bg-black inset-0 bg-opacity-5 absolute'>
        <h1 className=' text-4xl md:text-9xl font-bold  text-white text-center py-10 '>
          VACTINO <br /> READY
        </h1>
        <p className='text-white md:text-lg text-sm tracking-tight'>Explore our vaction-ready outfits with fast worldwide shipping.</p>
        <button className='text-gray-950 bg-white border rounded-sm border-black px-6 py-2 mt-10'>Shop Now</button>
    </div>

    </section>
  )
}

export default Hero
