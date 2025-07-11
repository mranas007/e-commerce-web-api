import React from "react";

const Hero = ({
  title = "Discover the Latest Tech & Lifestyle Products",
  subtitle = "Shop the best deals on electronics, fashion, and more. Fast shipping. Easy returns. Unbeatable prices.",
}) => (
  <section className={`relative w-full py-20 px-4 md:px-0 text-center overflow-hidden bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400`}>
    {/* Decorative Blobs */}
    <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300 opacity-30 rounded-full blur-3xl -z-10 animate-pulse" />
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" />
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      <h1 className={`text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg text-white`}>
        {title}
      </h1>
      <p className="text-lg md:text-2xl mb-8 text-white/90 font-medium drop-shadow">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <a
          href="/products"
          className="px-8 py-3 rounded-full bg-white text-blue-700 font-bold text-lg shadow-lg hover:bg-blue-50 transition"
        >
          Shop Now
        </a>
        <a
          href="/register"
          className="px-8 py-3 rounded-full bg-blue-700 text-white font-bold text-lg shadow-lg hover:bg-blue-800 transition"
        >
          Join Free
        </a>
      </div>
    </div>
  </section>
);

export default Hero;