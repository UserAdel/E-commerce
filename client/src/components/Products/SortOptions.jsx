import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams()
const handelSortChange = (e) => {
  const sortBy=e.target.value;
  searchParams.set("SortBy",sortBy);
  setSearchParams(searchParams);
}
  return (
    <div className='mb-4 flex items-center justify-end'> 
    <select  id="Sort" onChange={handelSortChange} value={searchParams.get("SortBy") || ""} className='border p-2 roundede-md focus:outline-none'>
      <option value="">Default </option>
      <option value="priceAsc">Price Low to High </option>
      <option value="priceDesc"> Price High to Low</option>
      <option value="popularity">Popularity </option>      
       </select>

     </div>
  )
}

export default SortOptions
