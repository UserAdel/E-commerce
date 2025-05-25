import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {fetchAdminProducts,deleteProduct,} from "../../redux/slices/adminProductSlice"


const ProductManagement = () => {


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { products,loading,error } = useSelector((state) => state.adminProducts);

useEffect(() => {
    dispatch(fetchAdminProducts());
}, [dispatch]);




const HandleDelete=(id)=>{
    if(window.confirm("Are you sure you want to delete this product?")){
      dispatch(deleteProduct());
    }
}




    if (loading) return <p>loading ...</p>;
  if (error) return <p>error {error}</p>;


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
              <td className="px-6 py-4 flex ">
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
