import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axiosInstance.get("/Cart/get-cart-items");
        setCartItems(res.data);
      } catch (error) {
        console.error("Failed to fetch cart items:", error?.error || error);
      }
    };
    fetchCartItems();
  }, []);

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Check authentication
  if (!token) {
    return <Navigate to="/login" replace />;
  }


  // Handler for increasing quantity
  const handleIncrease = async (productId) => {
    try {
      const res = await axiosInstance.post(`/Cart/add-to-cart?productId=${productId}`);
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } catch (err) {
      console.error("Failed to increase quantity:", err);
    }
  };

  // Handler for decreasing quantity
  const handleDecrease = async (productId) => {
    // Prevent decreasing below 1
    const item = cartItems.find((i) => i.product.id === productId);
    if (!item || item.quantity <= 1) return;
    try {
      const res = await axiosInstance.post(`/Cart/remove-to-cart?productId=${productId}`);
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    } catch (err) {
      console.error("Failed to decrease quantity:", err);
    }
  };

  // Responsive Cart UI with dropdown for mobile and quantity controls
  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-600">Your cart is empty.</div>
        ) : (
          <div>
            <ul className="divide-y divide-gray-200 mb-6">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="py-6 px-4 flex flex-col sm:flex-row items-center bg-white rounded-lg shadow mb-4"
                >
                  {/* Product Image */}
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="w-24 h-24 object-cover rounded-lg mr-0 sm:mr-6 mb-4 sm:mb-0 border"
                  />
                  {/* Product Details (Unified for all screens) */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-semibold text-lg text-gray-800">{item.product?.name}</div>
                        <div className="text-gray-500 text-sm mb-2">{item.product?.description}</div>
                        <div className="text-gray-500 text-xs">
                          Added: {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex flex-col items-end mt-4 sm:mt-0">
                        <div className="text-gray-700">
                          <span className="font-medium">Unit Price:</span> ${item.product?.price?.toFixed(2)}
                        </div>
                        <div className="text-gray-700 flex items-center space-x-2 mt-1">
                          <span className="font-medium">Quantity:</span>
                          <button
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => handleDecrease(item.product.id)}
                            aria-label="Decrease quantity"
                          >-</button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => handleIncrease(item.product.id)}
                            aria-label="Increase quantity"
                          >+</button>
                        </div>
                        <div className="font-bold text-blue-600 mt-2">
                          Subtotal: ${(item.product?.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {/* Total Amount Section */}
            <div className="flex justify-end">
              <div className="bg-white rounded-lg shadow px-6 py-4 mt-4 w-full sm:w-auto flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-700 mt-2 sm:mt-0">
                  {isNaN(getTotal()) ? "$0.00" : `$${getTotal().toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItems;