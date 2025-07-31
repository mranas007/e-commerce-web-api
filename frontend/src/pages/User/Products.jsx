import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import Card from "../../components/Card";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 9; // Number of products per page

    // Fetch categories on mount
    useEffect(() => {
        axiosInstance.get("/Category/all")
            .then((categoriesRes) => {
                setCategories(["All", ...categoriesRes.data]);
            })
            .catch(() => setCategories(["All"]));
    }, []);

    // Fetch products when search, category, or page changes
    useEffect(() => {
        setLoading(true);

        // Build query params
        const params = {
            page,
            pageSize,
        };
        if (search.trim() !== "") {
            params.search = search.trim();
        }
        if (selectedCategory && selectedCategory !== "All") {
            params.category = selectedCategory;
        }

        axiosInstance.get("/Product/all", { params })
            .then((productsRes) => {
                // Support both paginated and non-paginated API responses
                if (Array.isArray(productsRes.data)) {
                    setProducts(productsRes.data);
                    console.log(productsRes.data)
                    setTotalPages(1);
                } else {
                    setProducts(productsRes.data.products || []);
                    setTotalPages(productsRes.data.totalPages || 1);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setProducts([]);
                setTotalPages(1);
            });
    }, [search, selectedCategory, page]);

    // Reset to first page when search or category changes
    useEffect(() => {
        setPage(1);
    }, [search, selectedCategory]);

    // Pagination controls
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        // Show up to 5 page numbers, with ellipsis if needed
        let start = Math.max(1, page - 2);
        let end = Math.min(totalPages, page + 2);

        if (end - start < 4) {
            if (start === 1) {
                end = Math.min(totalPages, start + 4);
            } else if (end === totalPages) {
                start = Math.max(1, end - 4);
            }
        }

        const pageNumbers = [];
        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-center mt-8 space-x-2">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded-md border ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-blue-50"}`}
                >
                    Prev
                </button>
                {start > 1 && (
                    <>
                        <button
                            onClick={() => setPage(1)}
                            className={`px-3 py-1 rounded-md border ${page === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-600 hover:bg-blue-50"}`}
                        >
                            1
                        </button>
                        {start > 2 && <span className="px-2 py-1 text-gray-400">...</span>}
                    </>
                )}
                {pageNumbers.map((num) => (
                    <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`px-3 py-1 rounded-md border ${page === num ? "bg-blue-500 text-white" : "bg-white text-blue-600 hover:bg-blue-50"}`}
                    >
                        {num}
                    </button>
                ))}
                {end < totalPages && (
                    <>
                        {end < totalPages - 1 && <span className="px-2 py-1 text-gray-400">...</span>}
                        <button
                            onClick={() => setPage(totalPages)}
                            className={`px-3 py-1 rounded-md border ${page === totalPages ? "bg-blue-500 text-white" : "bg-white text-blue-600 hover:bg-blue-50"}`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`px-3 py-1 rounded-md border ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-blue-50"}`}
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>
                {/* Search and Category Filter */}
                <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-4">
                    <div className="relative w-full sm:w-1/2">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-gray-800 placeholder-gray-400"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                            </svg>
                        </span>
                    </div>
                    <div className="relative w-full sm:w-1/4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full appearance-none pl-4 pr-10 py-2 rounded-xl border border-gray-200 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-gray-800"
                        >
                            {categories.map((cat) =>
                                typeof cat === "string" ? (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ) : (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                )
                            )}
                        </select>
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>
                </div>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : products.length === 0 ? (
                    <div className="text-center text-gray-500">No products found.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/**** card ****/}
                            {products.map((product) => (
                                <Card
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                        {renderPagination()}
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;