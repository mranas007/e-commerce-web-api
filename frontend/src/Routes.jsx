import { Routes, Route } from "react-router-dom";
import Home from "./pages/User/Home";
import Register from "./pages/Account/Register";
import Login from "./pages/Account/Login";
import Confirmation from "./pages/Account/Confirmation"; // Add this import
import Products from "./pages/User/Products";
import Cart from "./pages/User/CartItems"; // Import Cart component
import ProductDetails from "./pages/User/ProductDetails";
import Dashboard from "./pages/Admin/Dashboard";
import ProductList from "./pages/Admin/ProductList";
import ProductForm from "./pages/Admin/ProductForm";
import EditProduct from "./pages/Admin/EditProduct";
import ViewProduct from "./pages/Admin/ViewProduct";

const AppRoutes = () => (
  <Routes>
    <Route path="/home" element={<Home />} />
    <Route path="/products" element={<Products />} /> {/* Add this line */}
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/confirmation" element={<Confirmation />} />
    <Route path="/cart" element={<Cart />} /> {/* Add this line */}
    <Route path="/product/:id" element={<ProductDetails />} />
    
    {/* Admin Routes */}
    <Route path="/admin" element={<Dashboard />} />
    <Route path="/admin/products" element={<ProductList />} />
    <Route path="/admin/products/add" element={<ProductForm />} />
    <Route path="/admin/products/edit/:id" element={<EditProduct />} />
    <Route path="/admin/products/:id" element={<ViewProduct />} />
  </Routes>
);

export default AppRoutes;