import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from "react-icons/fa";
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from "../contexts/AuthContext";

const Card = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const { user, token } = useAuth();

  const { id, name, description, price, images, cartItems } = product;

  // Check if this product is already in the cart
  React.useEffect(() => {
    if (Array.isArray(cartItems)) {
      const found = cartItems.some(
        (item) =>
          (item.productId && item.productId === id) ||
          (item.product && item.product.id === id)
      );
      setAlreadyInCart(found);
    }
  }, [cartItems, id]);

  const handleAddToCart = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setAdding(true);
    try {
      await axiosInstance.post("/Cart/add-to-cart?productId=" + id);
      setAlreadyInCart(true);
    } catch (err) {
      console.log(err?.response?.data || err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 rounded-lg shadow-md hover:shadow-xl ${isHovered ? 'scale-105' : 'scale-100'} max-w-xs mx-auto bg-white`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount badge - can be conditionally rendered */}
      {/* <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-xs font-bold z-10">
          20% OFF
        </div> */}

      {/* Image container with zoom effect */}
      <div className="overflow-hidden">
        <img
          src={`${import.meta.env.VITE_PRODUCT_IMAGES_URL}${images[0]?.url}`}
          alt={name}
          className={`w-full h-56 object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </div>

      {/* Content container */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="font-bold text-xl text-gray-800 line-clamp-1">{name}</h2>
          <p className="text-green-600 font-bold ml-2">${price}</p>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>

        {/* Add to cart button or Already in Cart */}
        {alreadyInCart ? (
          <button
            disabled
            className="w-full py-2 px-4 rounded-md flex items-center justify-center bg-gray-400 text-white cursor-not-allowed"
          >
            <FaShoppingCart className="mr-2" />
            Already in Cart
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 bg-blue-600 hover:bg-blue-700 text-white ${adding ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <FaShoppingCart className="mr-2" />
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        )}
        <button
          className="w-full mt-2 py-2 px-4 rounded-md flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors duration-300"
          onClick={() => window.location.href = `/product/${product.id.replace(/\s+/g, '-').toLowerCase()}`}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;
