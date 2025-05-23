import { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../Products/FilterSidebar";
import SortOptions from "../Products/SortOptions";
import ProductGrid from "../Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {fetchProductsByFilters} from "../../redux/slices/productSlice"

const CollectionPage = () => {
const {collection} =useParams();
const dispatch =useDispatch();
const {products,loading,error} =useSelector((state)=>state.products);
const [searchParams] = useSearchParams();
const queryPrams = Object.fromEntries([...searchParams]);

//fetch products  
useEffect(()=>{
  dispatch(fetchProductsByFilters({     
    collection,
    ...queryPrams,
  }))
},[collection,dispatch,queryPrams])

console.log(products)

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
}, [issidebarOpen]);

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
        
        
        <ProductGrid products={products} loading={loading} error={error}/>
    
    </div>
  </div>
);
};

export default CollectionPage;
