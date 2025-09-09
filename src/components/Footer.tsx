
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return <footer className="w-full bg-white py-0">
      <div className="section-container">
        <p className="text-center text-gray-600 text-sm">
          Este modelo se inspira no{" "}
          <a href="https://x.com/BrettFromDJ" target="_blank" rel="noopener noreferrer" className="text-pulse-500 hover:underline">
            DesignJoy's
          </a>{" "}
          design BUILD WARS, construído inteiramente com Lovable por{" "}
          <a href="https://x.com/rezaul_arif" target="_blank" rel="noopener noreferrer" className="text-pulse-500 hover:underline">
            Rezaul Arif
          </a>
        </p>
        <div className="mt-2 text-center">
          <Link to="/admin" className="text-xs text-gray-400 hover:text-pulse-500 hover:underline">Área Administrativa</Link>
        </div>
      </div>
    </footer>;
};
export default Footer;
