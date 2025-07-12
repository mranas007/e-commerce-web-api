import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-star-${i}`} className="text-yellow-400" />);
    }
    return stars;
};

const ProductDetails = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        axiosInstance
            .get(`/Product/single/${id}`)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAddToCart = async () => {
        if (!token) {
            // Redirect to login if not authenticated
            window.location.href = "/login";
            return;
        }

        try {
            // Use the API to add to cart
            await axiosInstance.post(`/Cart/add-to-cart?productId=${id}`);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 1500);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!product) {
        return <div className="text-center py-10 text-red-500">Product not found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row gap-10 bg-white rounded-lg shadow-lg p-8">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full md:w-1/2 h-96 object-cover rounded"
                />
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <div className="flex items-center mb-2">
                        {renderRatingStars(product.rating)}
                        <span className="ml-2 text-gray-600">({product.rating})</span>
                    </div>
                    <p className="text-xl text-green-600 font-bold mb-4">${product.price}</p>
                    <p className="mb-6 text-gray-700">{product.description}</p>
                    <button
                        onClick={handleAddToCart}
                        className={`w-full md:w-auto px-8 py-3 rounded bg-blue-600 text-white font-bold flex items-center justify-center transition-colors duration-300 ${addedToCart ? "bg-green-500" : "hover:bg-blue-700"
                            }`}
                    >
                        <FaShoppingCart className="mr-2" />
                        {addedToCart ? "Added to Cart!" : "Add to Cart"}
                    </button>
                    <button
                        className="w-full md:w-auto mt-2 py-2 px-4 rounded-md flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors duration-300"
                        onClick={() => window.history.back()}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;