import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useSearchParams, useNavigate } from "react-router-dom";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const Id = searchParams.get("Id");
    const token = searchParams.get("token");

    if (!Id || !token) {
      setMessage("Invalid confirmation link.");
      setLoading(false);
      return;
    }

    const confirmEmail = async () => {
      try {
        console.log(typeof (Id) + ": " + Id)
        console.log(typeof (token) + ": " + token)
        const res = await axiosInstance.post("/Authentication/confirmEmail", {
          Id,
          token,
        });
        console.log(res.data);
        setMessage("Your email has been confirmed! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } catch (err) {
        setMessage(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to confirm email. Please try again or request a new confirmation link."
        );
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Confirming your email...</h2>
        {loading ? (
          <div>
            <div className="loader mx-auto mb-4"></div>
            <p className="text-gray-600">Please wait while we confirm your email.</p>
          </div>
        ) : (
          <p className="text-gray-700">{message}</p>
        )}
      </div>
      {/* Simple loader style */}
      <style>
        {`
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </section>
  );
};

export default ConfirmEmail;
