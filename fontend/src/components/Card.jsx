
import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from "react-icons/fa";

const Card = ({ image, title, description, price, rating = 4.5 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

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

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
    // Here you would typically add the item to cart state or call an API
  };

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-300 rounded-lg shadow-md hover:shadow-xl ${isHovered ? 'scale-105' : 'scale-100'} max-w-xs bg-white`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount badge - can be conditionally rendered */}
      <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-xs font-bold z-10">
        20% OFF
      </div>
      
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
        <div className="flex mt-1 mb-2">
          {renderRatingStars(rating)}
          <span className="text-gray-500 text-sm ml-1">({rating})</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
        
        {/* Add to cart button */}
        <button 
          onClick={handleAddToCart}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 ${addedToCart ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          <FaShoppingCart className="mr-2" />
          {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default Card;
