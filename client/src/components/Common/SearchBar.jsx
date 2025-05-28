import React from 'react'
import { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { BiX } from "react-icons/bi";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProductsByFilters } from '../../redux/slices/productSlice';

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggle = () => {
      setIsOpen(!isOpen);
    };

    const [search, setSearch] = useState('');
    const handleChange = (e) => {
      setSearch(e.target.value);
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (search.trim()) {
        dispatch(fetchProductsByFilters({ search: search.trim() }));
        navigate(`/collections/all?search=${encodeURIComponent(search.trim())}`);
        setIsOpen(false);
      }
    };

    return (
      <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? 'absolute md:top-1.5 top-0  left-0 w-full  bg-white h-16  z-50' : 'w-auto'}`}>
        {isOpen ? (
          <form onSubmit={handleSubmit} className="flex items-center justify-center relative w-full">
            <div className='relative w-1/2'>
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleChange}
                className="border rounded-md py-2 px-2 text-sm focus:outline-none w-full"
              />
              <button type="submit" className="absolute right-2 -top-0 h-full px-2">
                <FaSearch />
              </button>
              <button type="button" onClick={toggle} className="absolute -right-10 -top-0 h-full px-2 ">
                <BiX className='w-6 h-6'/>
              </button>
            </div>
          </form>
        ) : (
          <button type="button" onClick={toggle}>
            <FaSearch className="w-5 h-5" />
          </button>
        )}
      </div>
    );
}

export default SearchBar
