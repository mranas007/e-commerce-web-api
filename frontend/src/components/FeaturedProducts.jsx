import React from "react";
import Card from "../components/Card";


const FeaturedProducts = ({ products }) => (
    <div className="container mx-auto pt-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">Featured Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <Card
                    key={product.id}
                    id={product.id}
                    image={product.image}
                    title={product.name}
                    description={product.description}
                    price={product.price}
                    rating={product.rating}
                    cartItems={product.cartItems}
                />
            ))}
        </div>
    </div>
);

export default FeaturedProducts;