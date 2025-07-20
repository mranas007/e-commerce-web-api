import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/User/Home";
import Register from "./pages/Account/Register";
import Login from "./pages/Account/Login";
import Confirmation from "./pages/Account/Confirmation";
import Products from "./pages/User/Products";
import Cart from "./pages/User/CartItems";
import ProductDetails from "./pages/User/ProductDetails";
import Dashboard from "./pages/Admin/Dashboard";
import ProductList from "./pages/Admin/ProductList";
import ProductForm from "./pages/Admin/ProductForm";
import EditProduct from "./pages/Admin/EditProduct";
import ViewProduct from "./pages/Admin/ViewProduct";
import CategoryList from "./pages/Admin/CategoryList";
import CategoryForm from "./pages/Admin/CategoryForm";
import ProtectedRoute from "./components/ProtectedRoute";
import ConfirmEmail from "./pages/Account/ConfirmEmail";

const AppRoutes = () => (
  <Routes>
    {/* Redirect root to home */}
    <Route path="/" element={<Navigate to="/home" replace />} />
    
    {/* Public Routes */}
    <Route path="/home" element={<Home />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/confirmation" element={<Confirmation />} />
    <Route path="/confirm-email" element={<ConfirmEmail />} />
    
    {/* Protected User Routes */}
    <Route path="/products" element={
      <ProtectedRoute>
        <Products />
      </ProtectedRoute>
    } />
    <Route path="/cart" element={
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    } />
    <Route path="/product/:id" element={
      <ProtectedRoute>
        <ProductDetails />
      </ProtectedRoute>
    } />
    
    {/* Protected Admin Routes */}
    <Route path="/admin" element={
      <ProtectedRoute requireAdmin={true}>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/admin/products" element={
      <ProtectedRoute requireAdmin={true}>
        <ProductList />
      </ProtectedRoute>
    } />
    <Route path="/admin/products/add" element={
      <ProtectedRoute requireAdmin={true}>
        <ProductForm />
      </ProtectedRoute>
    } />
    <Route path="/admin/products/edit/:id" element={
      <ProtectedRoute requireAdmin={true}>
        <EditProduct />
      </ProtectedRoute>
    } />
    <Route path="/admin/products/:id" element={
      <ProtectedRoute requireAdmin={true}>
        <ViewProduct />
      </ProtectedRoute>
    } />
    <Route path="/admin/categories" element={
      <ProtectedRoute requireAdmin={true}>
        <CategoryList />
      </ProtectedRoute>
    } />
    <Route path="/admin/categories/add" element={
      <ProtectedRoute requireAdmin={true}>
        <CategoryForm />
      </ProtectedRoute>
    } />
    <Route path="/admin/categories/edit/:id" element={
      <ProtectedRoute requireAdmin={true}>
        <CategoryForm />
      </ProtectedRoute>
    } />
  </Routes>
);

export default AppRoutes;