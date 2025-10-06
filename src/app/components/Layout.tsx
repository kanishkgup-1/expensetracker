"use client";

import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow bg-gray-50">
        <main className="flex-grow p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
