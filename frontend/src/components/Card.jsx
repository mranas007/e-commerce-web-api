import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from "react-icons/fa";
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from "../contexts/AuthContext";

const Card = ({
  id,
  image,
  title,
  description,
  price,
  rating = 0,
  cartItems = [],
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const { user, token } = useAuth();

  // Check if this product is already in the cart
  React.useEffect(() => {
    if (Array.isArray(cartItems)) {
      // cartItems may have productId or product object with id
      const found = cartItems.some(
        (item) =>
          (item.productId && item.productId === id) ||
          (item.product && item.product.id === id)
      );
      setAlreadyInCart(found);
    }
  }, [cartItems, id]);

  // Generate rating stars
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-star-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  const handleAddToCart = async () => {
    if (!token) {
      // Redirect to login if not authenticated
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
          src={image}
          alt={title}
          className={`w-full h-56 object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </div>

      {/* Content container */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="font-bold text-xl text-gray-800 line-clamp-1">{title}</h2>
          <p className="text-green-600 font-bold ml-2">${price}</p>
        </div>

        {/* Rating stars */}
        {rating > 0 && (
          <div className="flex mt-1 mb-2">
            {renderRatingStars(rating)}
            <span className="text-gray-500 text-sm ml-1">({rating})</span>
          </div>
        )}

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
          onClick={() => window.location.href = `/product/${id.replace(/\s+/g, '-').toLowerCase()}`}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;
