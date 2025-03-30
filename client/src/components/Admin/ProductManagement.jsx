import React from 'react'
import { Link } from 'react-router-dom'

const ProductManagement = () => {

const HandleDelete=(id)=>{
    if(window.confirm("Are you sure you want to delete this product?")){
        // API call to delete the product 
        console.log(id)
    }
}

const products=[{
_id: "1",
name: "Stylish Jacket",
price: 120,
sku: "1234",
}]


  return (
    <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">product Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className='min-w-full text-left  text-gray-500'>
        <thead className='bg-gray-200 text-xs uppercase text-gray-700'>
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> 
            </tr>
        </thead>
        <tbody>
        {products.length > 0 ? (
          products.map(product => (
            <tr key={product._id} className='hover:bg-gray-50'>
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4">{product.price}</td>
              <td className="px-6 py-4">{product.sku}</td>
              <td className="px-6 py-4 ">
                <Link to={`${products._id}/edit`} className="text-white hover:bg-yellow-600 bg-yellow-500 py-1 px-2 rounded ">Edit</Link>
                <button onClick={()=>HandleDelete(product._id)} className="text-white bg-red-500 hover:bg-red-600 py-1 px-2 rounded ml-3">Delete</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="px-6 py-4 text-center">No products available</td>
          </tr>
        )}

        </tbody>



        </table>
      </div>
    </div>
  )
}

export default ProductManagement
