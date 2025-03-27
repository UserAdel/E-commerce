import { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../Products/FilterSidebar";
import SortOptions from "../Products/SortOptions";
import ProductGrid from "../Products/ProductGrid";

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sidebarRef = useRef(null);
  const [issidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!issidebarOpen);
  };

  const handelClickOutside = (e) => {
    if (
      issidebarOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target)
    ) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handelClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handelClickOutside);
    };
  }, [issidebarOpen]); // Add dependency

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const fetchedProducts = [
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
      setProducts(fetchedProducts); // Fixed: Use fetchedProducts instead of products
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      <button onClick={toggleSidebar} className="lg:hidden border p-2 flex justify-center items-center mb-4">
        <FaFilter className="mr-2" /> Filter
      </button>
      
      {/* Filter Sidebar */}
      <div 
        className={`${issidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed z-50 overflow-auto bg-white inset-y-0 left-0 w-64 transition-transform duration-300 lg:static lg:translate-x-0`} 
        ref={sidebarRef}
      >
        <FilterSidebar />
      </div>
      
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collections</h2>
        {/* Sort Options */}
        <SortOptions />
        
        {loading ? (
          <div className="py-10 text-center">Loading products...</div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
