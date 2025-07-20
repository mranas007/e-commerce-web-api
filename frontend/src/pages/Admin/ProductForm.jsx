import React, { useState, useEffect } from "react";
import { FaSave, FaUpload, FaSpinner } from "react-icons/fa";
import AdminHeader from "../../components/Admin/AdminHeader";
import ImageModal from "../../components/Admin/ImageModal";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

import { useAuth } from "../../contexts/AuthContext";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Categories state
  const [categories, setCategories] = useState(["All"]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
    isActive: true
  });

  const [errors, setErrors] = useState({});

  // Fetch categories on mount
  useEffect(() => {
    axiosInstance.get("/Category/all")
      .then((categoriesRes) => {
        setCategories(["All", ...categoriesRes.data]);
      })
      .catch(() => setCategories(["All"]));
  }, []);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/Product/get-product/${id}`);
      const product = response.data;
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || "",
        imageUrl: product.imageUrl || "",
        isActive: product.isActive !== undefined ? product.isActive : true
      });
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: file.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (id) {
        await axiosInstance.put(`/Product/update-product/${id}`, productData);
      } else {
        await axiosInstance.post("/Product/add-product", productData);
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      setErrors({ submit: "Failed to save product. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  // Check authentication
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title={id ? "Edit Product" : "Add New Product"}
          subtitle={id ? "Update product information" : "Create a new product listing"}
          showCancelButton={true}
          onCancelClick={() => navigate("/admin/products")}
          showSaveButton={true}
          onSaveClick={handleSubmit}
          saveButtonLoading={saving}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat === "All" ? "" : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaUpload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
                {imagePreview && (
                  <div className="w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Product is active</span>
              </label>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>{id ? "Update Product" : "Create Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;