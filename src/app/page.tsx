"use client";
import React from "react";
import Layout from "./components/Layout";
import Header from "./components/Header";


const HomePage: React.FC = () => {
  return (
    <Layout>
      <Header title="Welcome to Expense Tracker (Made by Ankit and Kanishk)" />
      <p className="text-gray-700 mt-4">
        Use the sidebar to navigate to Dashboard, Expense, Categories, or Settings.
      </p>
    </Layout>
  );
};

export default HomePage;
