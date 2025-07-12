import React from "react";
import { Link } from "react-router-dom";

const Confirmation = () => (
    <section className = "bg-gray-100 min-h-screen flex items-center justify-center" >
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Registration Successful!</h2>
            <p className="mb-6 text-gray-700">
                Please check your email for confirmation to complete your registration.
            </p>
            <Link
                to="/login"
                className="inline-block px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
                Go to Login
            </Link>
        </div>
    </section >
);

export default Confirmation;