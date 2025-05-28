import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAdminProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../redux/slices/adminProductSlice";
import { toast } from "sonner";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { products = [], loading, error } = useSelector((state) => state.adminProduct) || {};

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    countInStock: "",
    image: "",
    colors: "",
    sizes: "",
    material: "",
    brand: "",
    sku: "",
    gender: "Men",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const categories = [
    "Top Wear",
    "Bottom Wear"
  ];

  const genderOptions = ["Men", "Women"];

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) {
        navigate("/");
        return;
      }
      try {
        await dispatch(fetchAdminProducts()).unwrap();
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };

    fetchProducts();
  }, [user, dispatch, navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert comma-separated strings to arrays
      const formDataToSubmit = {
        ...formData,
        colors: formData.colors.split(',').map(color => color.trim()),
        sizes: formData.sizes.split(',').map(size => size.trim()),
        images: formData.image.split(',').map(url => ({
          url: url.trim(),
          altText: formData.name
        })),
        sku: formData.sku.trim()
      };

      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct._id, ...formDataToSubmit })).unwrap();
        toast.success("Product updated successfully");
      } else {
        await dispatch(addProduct(formDataToSubmit)).unwrap();
        toast.success("Product added successfully");
      }
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        countInStock: "",
        image: "",
        colors: "",
        sizes: "",
        material: "",
        brand: "",
        sku: "",
        gender: "Men",
      });
      setEditingProduct(null);
    } catch (error) {
      toast.error(error || "Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      category: product.category || "",
      countInStock: product.countInStock?.toString() || "",
      image: product.images?.map(img => img.url).join(", ") || "",
      sku: product.sku || "",
      brand: product.brand || "",
      sizes: product.sizes?.join(",") || "",
      colors: product.colors?.join(",") || "",
      collections: product.collections || "",
      material: product.material || "",
      gender: product.gender || "Men",
      isFeatured: product.isFeatured || false,
      isPublished: product.isPublished || false,
      tag: product.tag?.join(",") || "",
      dimension: product.dimension || {},
      weight: product.weight?.toString() || ""
    });
    
    // Scroll to form
    const formElement = document.getElementById('product-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete product");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      
      {/* Add/Edit Product Form */}
      <div id="product-form" className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter product SKU (e.g., CAT-001)"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {genderOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter product price"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="countInStock"
              value={formData.countInStock}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter available stock quantity"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Colors (comma-separated)</label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Red, Blue, Green, Black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sizes (comma-separated)</label>
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., S, M, L, XL, XXL"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Material</label>
            <input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Cotton, Wool, Denim, Polyester"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Urban Threads, Modern Fit, Street Style, Beach Breeze, Fashionista, ChicStyle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter product description"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URLs (comma-separated)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: "",
                    description: "",
                    price: "",
                    category: "",
                    countInStock: "",
                    image: "",
                    colors: "",
                    sizes: "",
                    material: "",
                    brand: "",
                    sku: "",
                    gender: "Men",
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.images?.[0]?.url || product.image}
                      alt={product.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.countInStock || product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
