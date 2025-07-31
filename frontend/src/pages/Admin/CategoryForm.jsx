import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import axiosInstance from '../../utils/axiosConfig';
import AdminHeader from '../../components/Admin/AdminHeader';

import { useAuth } from '../../contexts/AuthContext';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/Category/single/${id}`);
      const category = response.data;
      setFormData({
        name: category.name || "",
        id: category.id || null
      });
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
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
      if (id) {
        const res = await axiosInstance.put(`/Category/update/`,
          {
            id: id,
            name: formData.name
          });
        console.log(res.data)
      } else {
        const res = await axiosInstance.post("/Category/add", formData);
        console.log(res.data)
      }

      navigate("/admin/categories");
    } catch (error) {
      console.error("Error saving category:", error);
      setErrors({ submit: "Failed to save category. Please try again." });
    } finally {
      setSaving(false);
    }
  };

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
          title={id ? "Edit Category" : "Add New Category"}
          subtitle={id ? "Update category information" : "Create a new category listing"}
          showCancelButton={true}
          onCancelClick={() => navigate("/admin/categories")}
          showSaveButton={true}
          onSaveClick={handleSubmit}
          saveButtonLoading={saving}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Details</h2>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Electronics, Books, Clothing"
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/admin/categories")}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : (id ? 'Update Category' : 'Add Category')}
                </button>
              </div>
              {errors.submit && <p className="mt-2 text-sm text-red-600 text-center">{errors.submit}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;