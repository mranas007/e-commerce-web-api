import React from "react";
import FeaturedProducts from "../../components/FeaturedProducts";
import Hero from "../../components/Hero";

function Home() {
  // Sample product data
  const products = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&w=400",
      title: "Premium Headphones",
      description: "Wireless noise cancelling headphones with premium sound quality and comfort.",
      price: 199.99,
      rating: 4.8
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&w=400",
      title: "Smart Watch",
      description: "Track your fitness, receive notifications, and more with this stylish smart watch.",
      price: 149.99,
      rating: 4.5
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&w=400",
      title: "4K Smart TV",
      description: "Ultra HD smart TV with built-in streaming apps and voice control.",
      price: 599.99,
      rating: 4.7
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&w=400",
      title: "Bluetooth Speaker",
      description: "Portable waterproof speaker with 20 hours of battery life.",
      price: 79.99,
      rating: 4.3
    },
    {
      id: 5,
      image: "https://images.pexels.com/photos/461077/pexels-photo-461077.jpeg?auto=compress&w=400",
      title: "Ergonomic Keyboard",
      description: "Comfortable typing experience with customizable RGB lighting.",
      price: 129.99,
      rating: 4.6
    },
    {
      id: 6,
      image: "https://images.pexels.com/photos/394565/pexels-photo-394565.jpeg?auto=compress&w=400",
      title: "Gaming Mouse",
      description: "High-precision gaming mouse with programmable buttons.",
      price: 59.99,
      rating: 4.4
    }
  ];

  return (
    <>
      <Hero />
      <FeaturedProducts products={products} />
    </>
  );
}

export default Home;