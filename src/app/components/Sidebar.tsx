"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiHome, FiDollarSign, FiList, FiSettings } from "react-icons/fi";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // collapsed by default

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside
      className={`bg-gray-800 text-white min-h-screen p-4 flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className={`mb-6 text-white focus:outline-none flex items-center justify-center ${
          isOpen ? "justify-start" : "justify-center"
        }`}
      >
        <FiMenu size={24} />
        {isOpen && <span className="ml-2">Menu</span>}
      </button>

      {/* Logo */}
      {isOpen && <h1 className="text-2xl font-bold mb-10">Expense Tracker</h1>}

      {/* Links */}
      <nav className="flex flex-col space-y-4">
        <Link
          href="/dashboard"
          className="flex items-center hover:bg-gray-700 px-3 py-2 rounded"
        >
          <FiHome size={24} className="mx-auto md:mx-0" />
          {isOpen && <span className="ml-2">Dashboard</span>}
        </Link>

        <Link
          href="/expense"
          className="flex items-center hover:bg-gray-700 px-3 py-2 rounded"
        >
          <FiDollarSign size={24} className="mx-auto md:mx-0" />
          {isOpen && <span className="ml-2">Expense</span>}
        </Link>

        <Link
          href="/categories"
          className="flex items-center hover:bg-gray-700 px-3 py-2 rounded"
        >
          <FiList size={24} className="mx-auto md:mx-0" />
          {isOpen && <span className="ml-2">Categories</span>}
        </Link>

        <Link
          href="/settings"
          className="flex items-center hover:bg-gray-700 px-3 py-2 rounded"
        >
          <FiSettings size={24} className="mx-auto md:mx-0" />
          {isOpen && <span className="ml-2">Settings</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;