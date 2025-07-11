import { Routes, Route } from "react-router-dom";
import Home from "./pages/Guest/Home";
import Register from "./pages/Account/Register";
import Login from "./pages/Account/Login";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
  </Routes>
);

export default AppRoutes;