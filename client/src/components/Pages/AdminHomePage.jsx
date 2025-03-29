import React from 'react'

const AdminHomePage = () => {

  const orders = [
    {
      _id: 123123,
      user: {
        name: "John Doe",
      },
      totalPrice: 110,
      status: "Processing",
    },
  ];
  
  

  return (
    <div>
      Admin Home Page
    </div>
  )
}

export default AdminHomePage
