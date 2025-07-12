import React, { useEffect, useState } from "react";
import FeaturedProducts from "../../components/FeaturedProducts";
import Hero from "../../components/Hero";
import axiosInstance from "../../utils/axiosConfig"; // import your axios instance

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/Product/all")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <FeaturedProducts products={products} />
      )}
    </>
  );
}

export default Home;
