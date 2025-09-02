import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../Products/FilterSidebar";
import SortOptions from "../Products/SortOptions";
import ProductGrid from "../Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../../redux/slices/productSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();
  
  // Memoize queryParams to prevent unnecessary re-renders
  const queryParams = useMemo(() => {
    return Object.fromEntries([...searchParams]);
  }, [searchParams]);

  // Memoize the fetch function
  const fetchProducts = useCallback(async () => {
    try {
      console.log("Dispatching fetchProductsByFilters with:", { collection, ...queryParams });
      const result = await dispatch(fetchProductsByFilters({     
        collection,
        ...queryParams,
      })).unwrap();
      console.log("Fetch products success:", result);
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  }, [collection, dispatch, queryParams]);

  //fetch products  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sidebarRef = useRef(null);
  const [issidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handelClickOutside = useCallback((e) => {
    // Only close sidebar if clicking outside the sidebar
    if (issidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setSidebarOpen(false);
    }
  }, [issidebarOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handelClickOutside);
    return () => {
      document.removeEventListener("mousedown", handelClickOutside);
    };
  }, [handelClickOutside]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <button 
        onClick={toggleSidebar} 
        className="lg:hidden border p-2 flex justify-center items-center mb-4"
      >
        <FaFilter className="mr-2" /> Filter
      </button>
      
      {/* Filter Sidebar */}
      <div 
        className={`${
          issidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed z-50 overflow-auto bg-white inset-y-0 left-0 w-64 transition-transform duration-300 lg:static lg:translate-x-0`} 
        ref={sidebarRef}
      >
        <FilterSidebar />
      </div>
      
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collections</h2>
        <SortOptions />
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          {!loading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h2>
              <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
            </div>
          ) : (
            <ProductGrid products={products} loading={loading} error={error} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
