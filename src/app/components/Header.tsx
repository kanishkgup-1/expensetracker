"use client";

import React from "react";
import Link from "next/link";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="mb-6 border-b border-gray-300 pb-2 flex justify-between items-center">
      {/* Left side: dynamic page title */}
      <h1 className="text-2xl font-semibold">{title}</h1>

      {/* Right side: Go to Home button */}
      <Link
        href="/"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </header>
  );
};

export default Header;
