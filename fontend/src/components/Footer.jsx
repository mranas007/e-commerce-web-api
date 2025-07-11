import React from "react";

const Footer = () => (
  <footer className="bg-primary-dark text-white py-6 mt-10 shadow-inner animate-fadeInUp">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
      <div className="mb-4 md:mb-0 font-semibold">&copy; {new Date().getFullYear()} MyStore. All rights reserved.</div>
      <div className="flex space-x-6">
        <a href="#" className="hover:text-accent transition-colors duration-200">Privacy Policy</a>
        <a href="#" className="hover:text-accent transition-colors duration-200">Terms</a>
        <a href="#" className="hover:text-accent transition-colors duration-200">Contact</a>
      </div>
      <div className="flex space-x-4 mt-4 md:mt-0">
        <a href="#" aria-label="Facebook" className="hover:text-primary-light transition-colors duration-200">
          <span className="material-icons">facebook</span>
        </a>
        <a href="#" aria-label="Twitter" className="hover:text-primary-light transition-colors duration-200">
          <span className="material-icons">twitter</span>
        </a>
        <a href="#" aria-label="Instagram" className="hover:text-primary-light transition-colors duration-200">
          <span className="material-icons">instagram</span>
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;