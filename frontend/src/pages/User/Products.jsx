import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import Card from "../../components/Card";

const Products = () => {
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
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
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
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;