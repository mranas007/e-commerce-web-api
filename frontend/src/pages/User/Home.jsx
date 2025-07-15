import React, { useEffect, useState } from "react";
import FeaturedProducts from "../../components/FeaturedProducts";
import Hero from "../../components/Hero";
import { useAuth } from "../../contexts/AuthContext";
import axiosInstance from "../../utils/axiosConfig"; // import your axios instance

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token, isAdmin, isUser } = useAuth();

  useEffect(() => {
    axiosInstance
      .get("/Product/all")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  }, []);

  return (
    <>
      <Hero />


      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <FeaturedProducts products={products} />
      )}
    </>
  );
}

export default Home;
