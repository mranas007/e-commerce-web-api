import React, { useState, useEffect } from "react";
import { FaSave, FaUpload, FaSpinner, FaTrash, FaEye } from "react-icons/fa";
import AdminHeader from "../../components/Admin/AdminHeader";
import ImageModal from "../../components/Admin/ImageModal";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

import { useAuth } from "../../contexts/AuthContext";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

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
        setOriginalImage(product.imageUrl);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setErrors({ fetch: "Failed to load product. Please try again." });
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

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      imageUrl: ""
    }));
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

      await axiosInstance.put(`/Product/update-product/${id}`, productData);
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      setErrors({ submit: "Failed to update product. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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

  if (errors.fetch) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Product</h3>
              <p className="text-gray-600 mb-4">{errors.fetch}</p>
              <button
                onClick={() => navigate("/admin/products")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="Edit Product"
          subtitle="Update product information and settings"
          showBackButton={true}
          onBackClick={() => navigate("/admin/products")}
          showSaveButton={true}
          onSaveClick={handleSubmit}
          saveButtonLoading={saving}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product Preview */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Preview</h2>

                  {/* Image Section */}
                  <div className="mb-6">
                    <div className="relative">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <button
                              onClick={() => setShowImageModal(true)}
                              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                              title="View Full Size"
                            >
                              <FaEye className="text-xs" />
                            </button>
                            <button
                              onClick={removeImage}
                              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors duration-200"
                              title="Remove Image"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <FaUpload className="text-gray-400 text-4xl mb-2" />
                            <p className="text-gray-500">No image uploaded</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{formData.name || "Product Name"}</h3>
                      <p className="text-green-600 font-bold text-lg">
                        {formData.price ? formatPrice(formData.price) : "$0.00"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {formData.description || "No description available"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Category:</span>
                      <span className="text-sm font-medium text-gray-900">{formData.category || "Uncategorized"}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Stock:</span>
                      <span className={`text-sm font-medium ${formData.stock > 10 ? 'text-green-600' :
                        formData.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {formData.stock || 0} units
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`text-sm font-medium ${formData.isActive ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Edit Product Details</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"
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
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? "border-red-500" : "border-gray-300"
                            }`}
                        >
                          <option value="">Select category</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Clothing">Clothing</option>
                          <option value="Books">Books</option>
                          <option value="Home & Garden">Home & Garden</option>
                          <option value="Sports">Sports</option>
                          <option value="Beauty">Beauty</option>
                          <option value="Toys">Toys</option>
                          <option value="Other">Other</option>
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
                            className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.price ? "border-red-500" : "border-gray-300"
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
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.stock ? "border-red-500" : "border-gray-300"
                            }`}
                          placeholder="0"
                        />
                        {errors.stock && (
                          <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder="Enter product description"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                      )}
                    </div>

                    {/* Image Upload */}
                    <div>
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
                      </div>
                    </div>

                    {/* Active Status */}
                    <div>
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

                    {/* Submit Error */}
                    {errors.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600">{errors.submit}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end mt-6">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                      >
                        {saving ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <FaSave />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ImageModal
        isOpen={showImageModal}
        imageUrl={imagePreview}
        altText="Product preview"
        onClose={() => setShowImageModal(false)}
      />
    </div>
  );
};

export default EditProduct;