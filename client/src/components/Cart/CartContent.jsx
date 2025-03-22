import React from 'react'
import { FaTrashAlt } from "react-icons/fa";


const CartProducts = [
  {
    productId: 1,
    Name: 'Casual T-Shirt',
    size: 'M',
    color: 'Blue',
    quantity: 2,
    price: 29.99,
    image: "https://picsum.photos/200?random=1"
  },
  {
    productId: 2,
    Name: 'Slim Fit Jeans',
    size: 'L',
    color: 'Black',
    quantity: 1,
    price: 49.99,
    image: "https://picsum.photos/200?random=2"
  },
  {
    productId: 3,
    Name: 'Hooded Sweatshirt',
    size: 'XL',
    color: 'Gray',
    quantity: 1,
    price: 39.99,
    image: "https://picsum.photos/200?random=3"
  },
  {
    productId: 4,
    Name: 'Lightweight Jacket',
    size: 'S',
    color: 'Navy',
    quantity: 1,
    price: 79.99,
    image: "https://picsum.photos/200?random=4"
  },
  {
    productId: 5,
    Name: 'Cotton Polo Shirt',
    size: 'M',
    color: 'Green',
    quantity: 3,
    price: 34.99,
    image: "https://picsum.photos/200?random=5"
  },
  {
    productId: 6,
    Name: 'Summer Shorts',
    size: 'M',
    color: 'Khaki',
    quantity: 1,
    price: 29.99,
    image: "https://picsum.photos/200?random=6"
  },
  {
    productId: 7,
    Name: 'Wool Sweater',
    size: 'L',
    color: 'Burgundy',
    quantity: 1,
    price: 59.99,
    image: "https://picsum.photos/200?random=7"
  }
]

const CartContent = () => {
  return (
    <div className=''>
      {CartProducts.map((product) => (
        <div key={product.productId} className="flex justify-between items-center border-b py-4">
          <img src={product.image} alt={product.Name} className="w-16 h-16 object-cover rounded" />
          <div className="flex-1 px-4">
            <h4 className="font-medium">{product.Name}</h4>
            <p className="text-sm text-gray-500">Size: {product.size} | Color: {product.color}</p>
            <div className='md:flex items-centex mt-2'>
              <button className="text-gray-500 border border-solid  px-2 py-1">-</button>
              <span className="px-2 pt-1">{product.quantity}</span>
              <button className="text-gray-500 border border-solid  px-2 py-1">+</button>
            </div>
          </div>

          <div className="text-right">
            <div>
          <p className="font-semibold ">${product.price.toLocaleString()}</p>
            </div>
          <button className='pr-2 mt-2'>
          <FaTrashAlt className='w-6 h-6'/>
          </button>
          </div>

        </div>
      ))}
    </div>
  )
}

export default CartContent
