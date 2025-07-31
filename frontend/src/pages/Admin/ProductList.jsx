import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import AdminProductCard from "../../components/Admin/AdminProductCard";
import AdminHeader from "../../components/Admin/AdminHeader";
import DeleteConfirmationModal from "../../components/Admin/DeleteConfirmationModal";
import axiosInstance from "../../utils/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";
import AdminNavbar from "../../components/Admin/AdminNavbar";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/Product/all");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/Category/all");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axiosInstance.delete(`/Product/delete-product/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    // Updated the main container to flex-col and adjusted padding for mobile responsiveness
    // Modified search and filter section to stack vertically on small screens and horizontally on larger screens
    <div className="flex  min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="Product Management"
          subtitle="Manage your product inventory"
          showAddButton={true}
          onAddClick={() => (window.location.href = "/admin/products/add")}
        />
    
        {/* Main Content */}
        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
    
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Sort by</option>
                  <option>Name A-Z</option>
                  <option>Name Z-A</option>
                  <option>Price Low-High</option>
                  <option>Price High-Low</option>
                </select>
              </div>
            </div>
          </div>
    
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                formatPrice={formatPrice}
                confirmDelete={confirmDelete}
              />
            ))}
          </div>
    
          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or add a new product.</p>
            </div>
          )}
        </div>
      </div>
    
      <DeleteConfirmationModal
        show={showDeleteModal}
        title="Confirm Delete"
        message={`Are you sure you want to delete \"${productToDelete?.name}\"? This action cannot be undone.`}
        onConfirm={() => handleDelete(productToDelete.id)}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ProductList;