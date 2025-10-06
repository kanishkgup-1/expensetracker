"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
      &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
    </footer>
  );
};

export default Footer;
