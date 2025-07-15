import { BrowserRouter, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./Routes";

function Layout() {
  const location = useLocation();
  // Check if the path starts with /register, /login, or /confirmation (case-insensitive)
  const hideLayout = /^\/(register|login|confirmation|confirm-email)/i.test(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <AppRoutes />
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
