import React from "react";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";



const NewArrivals = () => {


  const [newArrivals,setnewArrivals]=useState([]);
  
  useEffect(()=>{
    const fetchnewArrivals=async()=>{
      try {
        const response=await axios.get(`http://localhost:9000/api/products/new-arrivals`)
        setnewArrivals(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);s
      }
    }
    fetchnewArrivals();
  });


  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth;

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);

console.log(leftScroll, container.scrollWidth, container.clientWidth);

    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
    }
  },[newArrivals]);
  
  
  return (
    
    <div className="container mx-auto text-center mb-10 relative">
      <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
      <p className="text-lg text-gray-600 mb-8">
        Discover the latest styles straight off the runway, freshly added to
        keep your wardrobe on the cutting edge of fashion.
      </p>

      <div className="absolute justify-between right-0 top-32 flex md:top-16 space-x-2">
        <button onClick={() => scroll("left")} disabled={!canScrollLeft}>
          <FiChevronLeft className={`text-4xl rounded text-gray-600 cursor-pointer border border-solid ${!canScrollLeft ? "bg-gray-300 text-white" : ""}`} />
        </button>

        <button onClick={() => scroll("right")} >
          <FiChevronRight className={`text-4xl rounded text-gray-600 cursor-pointer border border-solid ${canScrollRight ? "bg-white text-black" : " bg-gray-200 text-gray-400 "}`} />
        </button>
      </div>
      <div
        ref={scrollRef}
        className="container mx-auto overflow-x-scroll scrollbar-hide flex space-x-6 relative"
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
          >
            <img
    check          src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
            />
            <div
              className="absolute bottom-0 left-0 right-0 bg-opacity-50 
            backdrop-blur-md rounded-b-lg text-white h-15"
            >
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-medium text-lg">{product.name}</h4>
                <p className="mt-1 text-lg">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
